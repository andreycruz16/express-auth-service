import { AuthSessionModel } from '@/modules/auth/auth.session.model.js';

export interface AuthSession {
  id: string;
  accountId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const toAuthSession = (document: {
  _id: { toString(): string };
  accountId: { toString(): string };
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): AuthSession => ({
  id: document._id.toString(),
  accountId: document.accountId.toString(),
  tokenHash: document.tokenHash,
  expiresAt: document.expiresAt,
  revokedAt: document.revokedAt,
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

export const authSessionRepository = {
  async create(input: { accountId: string; tokenHash: string; expiresAt: Date }): Promise<AuthSession> {
    const session = await AuthSessionModel.create(input);
    return toAuthSession(session);
  },

  async findActiveByTokenHash(tokenHash: string): Promise<AuthSession | null> {
    const session = await AuthSessionModel.findOne({
      tokenHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    }).exec();

    return session ? toAuthSession(session) : null;
  },

  async revokeById(id: string): Promise<void> {
    await AuthSessionModel.findByIdAndUpdate(id, { revokedAt: new Date() }).exec();
  },
};
