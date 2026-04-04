import { logger } from '@/infrastructure/logger/logger.js';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV ?? 'development';
dotenv.config({ path: `.env.${env}` });

logger.info(`🌱 Loaded env: .env.${env}`);

// Optional: validate required envs
if (!process.env.MONGO_URI) {
  throw new Error('❌ MONGO_URI is not defined');
}

if (!process.env.JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not defined');
}