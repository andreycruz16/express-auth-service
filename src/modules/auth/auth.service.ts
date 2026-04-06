import { AppError } from '@/shared/app-error.js';
import { env } from '@/config/env.js';
import { authRepository } from '@/modules/auth/auth.repository.js';
import { authSessionRepository } from '@/modules/auth/auth.session.repository.js';
import { comparePassword, hashPassword } from '@/infrastructure/password.js';
import { signAccessToken, verifyAccessToken } from '@/infrastructure/jwt.js';
import { generateRefreshToken, hashRefreshToken } from '@/infrastructure/refresh-token.js';
import { sendVerificationEmail } from '@/infrastructure/email.js';
import {
  generateEmailVerificationToken,
  hashEmailVerificationToken,
} from '@/infrastructure/email-verification.js';
import type {
  LoginInput,
  LogoutInput,
  RefreshInput,
  RegisterInput,
  ResendVerificationInput,
} from '@/modules/auth/auth.types.js';

const REFRESH_TOKEN_TTL_DAYS = 7;
const EMAIL_VERIFICATION_TTL_HOURS = env.EMAIL_VERIFICATION_TTL_HOURS;
const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const VERIFICATION_RESEND_CAP = 5;
const VERIFICATION_RESEND_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

const toUserResponse = (account: {
  id: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: account.id,
  email: account.email,
  emailVerified: account.emailVerified,
  emailVerifiedAt: account.emailVerifiedAt?.toISOString() ?? null,
  createdAt: account.createdAt.toISOString(),
  updatedAt: account.updatedAt.toISOString(),
});

const getRefreshTokenExpiry = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);
  return expiresAt;
};

const getEmailVerificationExpiry = () => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + EMAIL_VERIFICATION_TTL_HOURS);
  return expiresAt;
};

const buildEmailVerificationUrl = (token: string) => {
  const verificationUrl = new URL('/auth/verify-email', env.APP_BASE_URL);
  verificationUrl.searchParams.set('token', token);
  return verificationUrl.toString();
};

const enforceVerificationResendLimit = async (account: {
  id: string;
  verificationEmailLastSentAt: Date | null;
  verificationEmailResendCount: number;
  verificationEmailResendWindowStartedAt: Date | null;
}) => {
  const now = new Date();

  if (
    account.verificationEmailLastSentAt &&
    now.getTime() - account.verificationEmailLastSentAt.getTime() < VERIFICATION_RESEND_COOLDOWN_MS
  ) {
    throw new AppError('Please wait 60 seconds before requesting another verification email', 429);
  }

  const windowStartedAt = account.verificationEmailResendWindowStartedAt;
  const isWindowExpired =
    !windowStartedAt || now.getTime() - windowStartedAt.getTime() >= VERIFICATION_RESEND_WINDOW_MS;

  const nextWindowStartedAt = isWindowExpired ? now : windowStartedAt;
  const nextResendCount = isWindowExpired ? 1 : account.verificationEmailResendCount + 1;

  if (nextResendCount > VERIFICATION_RESEND_CAP) {
    throw new AppError('Verification email resend limit reached. Please try again in 24 hours', 429);
  }

  await authRepository.updateVerificationEmailResendState({
    accountId: account.id,
    verificationEmailLastSentAt: now,
    verificationEmailResendCount: nextResendCount,
    verificationEmailResendWindowStartedAt: nextWindowStartedAt,
  });
};

const issueEmailVerification = async (account: { id: string; email: string }) => {
  const emailVerificationToken = generateEmailVerificationToken();
  const emailVerificationTokenHash = hashEmailVerificationToken(emailVerificationToken);
  const emailVerificationExpiresAt = getEmailVerificationExpiry();

  await authRepository.updateEmailVerificationToken({
    accountId: account.id,
    emailVerificationTokenHash,
    emailVerificationExpiresAt,
  });

  await sendVerificationEmail(account.email, buildEmailVerificationUrl(emailVerificationToken));
};

const issueSessionTokens = async (account: {
  id: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) => {
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  await authSessionRepository.create({
    accountId: account.id,
    tokenHash: refreshTokenHash,
    expiresAt: getRefreshTokenExpiry(),
  });

  return {
    user: toUserResponse(account),
    accessToken: signAccessToken({ sub: account.id, email: account.email }),
    refreshToken,
  };
};

export const authService = {
  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email);

    if (existing) {
      throw new AppError('User already exists', 409);
    }

    const passwordHash = await hashPassword(input.password);
    const emailVerificationToken = generateEmailVerificationToken();
    const emailVerificationTokenHash = hashEmailVerificationToken(emailVerificationToken);
    const emailVerificationExpiresAt = getEmailVerificationExpiry();
    const account = await authRepository.create({
      email: input.email,
      passwordHash,
      emailVerificationTokenHash,
      emailVerificationExpiresAt,
    });

    await sendVerificationEmail(account.email, buildEmailVerificationUrl(emailVerificationToken));

    return {
      user: toUserResponse(account),
      message: 'Account created. Please verify your email address.',
    };
  },

  async login(input: LoginInput) {
    const account = await authRepository.findByEmail(input.email);

    if (!account) {
      throw new AppError('Invalid credentials', 401);
    }

    const passwordMatches = await comparePassword(input.password, account.passwordHash);

    if (!passwordMatches) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!account.emailVerified) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    return issueSessionTokens(account);
  },

  async refresh(input: RefreshInput) {
    const session = await authSessionRepository.findActiveByTokenHash(hashRefreshToken(input.refreshToken));

    if (!session) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const account = await authRepository.findById(session.accountId);

    if (!account) {
      throw new AppError('Unauthorized', 401);
    }

    await authSessionRepository.revokeById(session.id);

    return issueSessionTokens(account);
  },

  async logout(input: LogoutInput) {
    const session = await authSessionRepository.findActiveByTokenHash(hashRefreshToken(input.refreshToken));

    if (!session) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    await authSessionRepository.deleteById(session.id);
  },

  async getMe(userId: string) {
    const account = await authRepository.findById(userId);

    if (!account) {
      throw new AppError('User not found', 404);
    }

    return toUserResponse(account);
  },

  async verifyEmail(token: string) {
    const account = await authRepository.findByVerificationTokenHash(hashEmailVerificationToken(token));

    if (!account || !account.emailVerificationExpiresAt) {
      throw new AppError('Invalid verification token', 400);
    }

    if (account.emailVerified) {
      return {
        message: 'Email is already verified.',
      };
    }

    if (account.emailVerificationExpiresAt.getTime() < Date.now()) {
      throw new AppError('Verification token has expired', 400);
    }

    await authRepository.markEmailVerified(account.id);

    return {
      message: 'Email verified successfully.',
    };
  },

  async resendVerification(input: ResendVerificationInput) {
    const account = await authRepository.findByEmail(input.email);

    if (!account) {
      throw new AppError('User not found', 404);
    }

    if (account.emailVerified) {
      return {
        message: 'Email is already verified.',
      };
    }

    await enforceVerificationResendLimit(account);
    await issueEmailVerification(account);

    return {
      message: 'Verification email sent.',
    };
  },

  async authenticate(token: string) {
    try {
      const payload = verifyAccessToken(token);
      const account = await authRepository.findById(payload.sub);

      if (!account) {
        throw new AppError('Unauthorized', 401);
      }

      return {
        userId: account.id,
        email: account.email,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('Invalid token', 401);
    }
  },
};
