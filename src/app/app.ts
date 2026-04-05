import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { httpLogger } from '@/infrastructure/logger.js';
import { authLimiter, apiLimiter } from '@/app/middlewares/ratelimiter.middleware.js';
import authRoutes from '@/modules/auth/auth.routes.js';
import { errorHandler } from '@/app/middlewares/error.middleware.js';

export const createApp = () => {
  const app = express();

  app.use(httpLogger);
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(compression());

  app.use('/auth', authLimiter, authRoutes);

  app.get('/health', apiLimiter, (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use(errorHandler);

  return app;
};
