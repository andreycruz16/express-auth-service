import mongoose from 'mongoose';
import { logger } from '@/infrastructure/logger.js';

export const connectDB = async (mongoUri: string) => {
  try {
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error({ err: error }, 'DB connection failed');
    process.exit(1);
  }
};
