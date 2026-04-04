import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './features/auth/auth.route.js';
import { logger } from './infrastructure/logger/logger.js';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from '@/app/middlewares/error.middleware.js';

const env = process.env.NODE_ENV || 'development';
dotenv.config({
  path: `.env.${env}`,
});
console.log(`Running in ${env} environment`);

const app = express();
app.use(pinoHttp());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

app.use('/auth', authRoutes);

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/error', () => {
  throw new Error('Test error');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
