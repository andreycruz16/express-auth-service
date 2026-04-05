import type { Request } from 'express';

export interface AuthAccount {
  id: string;
  email: string;
  passwordHash: string;
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

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    email: string;
  };
}
