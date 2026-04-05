import { AppError } from '@/shared/app-error.js';
import { authRepository } from '@/modules/auth/auth.repository.js';
import { comparePassword, hashPassword } from '@/infrastructure/password.js';
import { signAccessToken, verifyAccessToken } from '@/infrastructure/jwt.js';
import type { LoginInput, RegisterInput } from '@/modules/auth/auth.types.js';

const toUserResponse = (account: {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: account.id,
  email: account.email,
  createdAt: account.createdAt.toISOString(),
  updatedAt: account.updatedAt.toISOString(),
});

export const authService = {
  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email);

    if (existing) {
      throw new AppError('User already exists', 409);
    }

    const passwordHash = await hashPassword(input.password);
    const account = await authRepository.create({ email: input.email, passwordHash });

    return toUserResponse(account);
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

    return {
      user: toUserResponse(account),
      token: signAccessToken({ sub: account.id, email: account.email }),
    };
  },

  async getMe(userId: string) {
    const account = await authRepository.findById(userId);

    if (!account) {
      throw new AppError('User not found', 404);
    }

    return toUserResponse(account);
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
