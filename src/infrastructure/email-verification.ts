import crypto from 'crypto';

export const generateEmailVerificationToken = () => crypto.randomBytes(32).toString('hex');

export const hashEmailVerificationToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');
