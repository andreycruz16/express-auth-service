import { logger } from '@/infrastructure/logger.js';
import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV ?? 'development';
dotenv.config({ path: `.env.${nodeEnv}` });

logger.info(`Loaded env file: .env.${nodeEnv}`);

if (!process.env.MONGO_URI) {
  throw new Error('❌ MONGO_URI is not defined');
}

if (!process.env.JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not defined');
}

if (!process.env.PORT) {
  throw new Error('❌ PORT is not defined');
}

if (!process.env.ACS_EMAIL_CONNECTION_STRING) {
  throw new Error('❌ ACS_EMAIL_CONNECTION_STRING is not defined');
}

if (!process.env.ACS_EMAIL_SENDER) {
  throw new Error('❌ ACS_EMAIL_SENDER is not defined');
}

if (!process.env.APP_BASE_URL) {
  throw new Error('❌ APP_BASE_URL is not defined');
}

export const env = {
  NODE_ENV: nodeEnv,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  ACS_EMAIL_CONNECTION_STRING: process.env.ACS_EMAIL_CONNECTION_STRING,
  ACS_EMAIL_SENDER: process.env.ACS_EMAIL_SENDER,
  APP_BASE_URL: process.env.APP_BASE_URL,
  EMAIL_VERIFICATION_TTL_HOURS: Number(process.env.EMAIL_VERIFICATION_TTL_HOURS ?? '24'),
};
