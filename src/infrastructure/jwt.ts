import jwt from 'jsonwebtoken';
import { env } from '@/config/env.js';

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export const signAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1d' });

export const verifyAccessToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
