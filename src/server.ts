import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './features/auth/auth.route.js';
import { logger } from './infrastructure/logger/logger.js';

const env = process.env.NODE_ENV || 'development';
dotenv.config({
  path: `.env.${env}`,
});
console.log(`Running in ${env} environment`);

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
