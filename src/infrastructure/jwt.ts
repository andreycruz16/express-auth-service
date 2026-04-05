import jwt from 'jsonwebtoken';
import { env } from '@/config/env.js';

const ACCESS_TOKEN_TTL = '15m';

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export const signAccessToken = (payload: AccessTokenPayload) => jwt.sign(payload, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

export const verifyAccessToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
