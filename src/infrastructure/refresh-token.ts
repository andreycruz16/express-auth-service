import crypto from 'crypto';

export const generateRefreshToken = () => crypto.randomBytes(48).toString('hex');

export const hashRefreshToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');
