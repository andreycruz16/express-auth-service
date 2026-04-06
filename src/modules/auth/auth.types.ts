import type { Request } from 'express';

export interface AuthAccount {
  id: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  emailVerificationTokenHash: string | null;
  emailVerificationExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  refreshToken: string;
}

export interface LogoutInput {
  refreshToken: string;
}

export interface ResendVerificationInput {
  email: string;
}

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    email: string;
  };
}
