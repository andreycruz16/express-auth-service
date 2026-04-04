import mongoose from 'mongoose';
import { logger } from '../logger/logger.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    logger.info('✅ MongoDB connected');
  } catch (error) {
    logger.error({ err: error }, '❌ DB connection failed');
    process.exit(1);
  }
};
