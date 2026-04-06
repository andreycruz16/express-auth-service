import { AuthModel } from '@/modules/auth/auth.model.js';
import type { AuthAccount } from '@/modules/auth/auth.types.js';

const toAuthAccount = (document: {
  _id: { toString(): string };
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  emailVerificationTokenHash: string | null;
  emailVerificationExpiresAt: Date | null;
  verificationEmailLastSentAt: Date | null;
  verificationEmailResendCount: number;
  verificationEmailResendWindowStartedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): AuthAccount => ({
  id: document._id.toString(),
  email: document.email,
  passwordHash: document.passwordHash,
  emailVerified: document.emailVerified,
  emailVerifiedAt: document.emailVerifiedAt,
  emailVerificationTokenHash: document.emailVerificationTokenHash,
  emailVerificationExpiresAt: document.emailVerificationExpiresAt,
  verificationEmailLastSentAt: document.verificationEmailLastSentAt,
  verificationEmailResendCount: document.verificationEmailResendCount,
  verificationEmailResendWindowStartedAt: document.verificationEmailResendWindowStartedAt,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

export const authRepository = {
  async findByEmail(email: string): Promise<AuthAccount | null> {
    const account = await AuthModel.findOne({ email: email.toLowerCase() }).exec();
    return account ? toAuthAccount(account) : null;
  },

  async findById(id: string): Promise<AuthAccount | null> {
    const account = await AuthModel.findById(id).exec();
    return account ? toAuthAccount(account) : null;
  },

  async findByVerificationTokenHash(tokenHash: string): Promise<AuthAccount | null> {
    const account = await AuthModel.findOne({ emailVerificationTokenHash: tokenHash }).exec();
    return account ? toAuthAccount(account) : null;
  },

  async create(input: {
    email: string;
    passwordHash: string;
    emailVerificationTokenHash: string;
    emailVerificationExpiresAt: Date;
  }): Promise<AuthAccount> {
    const account = await AuthModel.create({
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      emailVerified: false,
      emailVerifiedAt: null,
      emailVerificationTokenHash: input.emailVerificationTokenHash,
      emailVerificationExpiresAt: input.emailVerificationExpiresAt,
      verificationEmailLastSentAt: new Date(),
      verificationEmailResendCount: 0,
      verificationEmailResendWindowStartedAt: null,
    });

    return toAuthAccount(account);
  },

  async updateEmailVerificationToken(input: {
    accountId: string;
    emailVerificationTokenHash: string;
    emailVerificationExpiresAt: Date;
  }): Promise<void> {
    await AuthModel.findByIdAndUpdate(input.accountId, {
      emailVerificationTokenHash: input.emailVerificationTokenHash,
      emailVerificationExpiresAt: input.emailVerificationExpiresAt,
    }).exec();
  },

  async markEmailVerified(accountId: string): Promise<void> {
    await AuthModel.findByIdAndUpdate(accountId, {
      emailVerified: true,
      emailVerifiedAt: new Date(),
      emailVerificationTokenHash: null,
      emailVerificationExpiresAt: null,
      verificationEmailLastSentAt: null,
      verificationEmailResendCount: 0,
      verificationEmailResendWindowStartedAt: null,
    }).exec();
  },

  async updateVerificationEmailResendState(input: {
    accountId: string;
    verificationEmailLastSentAt: Date;
    verificationEmailResendCount: number;
    verificationEmailResendWindowStartedAt: Date;
  }): Promise<void> {
    await AuthModel.findByIdAndUpdate(input.accountId, {
      verificationEmailLastSentAt: input.verificationEmailLastSentAt,
      verificationEmailResendCount: input.verificationEmailResendCount,
      verificationEmailResendWindowStartedAt: input.verificationEmailResendWindowStartedAt,
    }).exec();
  },
};
