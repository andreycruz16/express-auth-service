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

export const env = {
  NODE_ENV: nodeEnv,
  PORT: Number(process.env.PORT ?? 3000),
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
