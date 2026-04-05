import { AuthModel } from '@/modules/auth/auth.model.js';
import type { AuthAccount } from '@/modules/auth/auth.types.js';

const toAuthAccount = (document: {
  _id: { toString(): string };
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}): AuthAccount => ({
  id: document._id.toString(),
  email: document.email,
  passwordHash: document.passwordHash,
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

  async create(input: { email: string; passwordHash: string }): Promise<AuthAccount> {
    const account = await AuthModel.create({
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
    });

    return toAuthAccount(account);
  },
};
