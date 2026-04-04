import mongoose from 'mongoose';
import { logger } from '../logger/logger.js';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ MongoDB connected');
    logger.info('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ DB connection failed', error);
    logger.error('❌ DB connection failed: ' + error);
    process.exit(1);
  }
};
