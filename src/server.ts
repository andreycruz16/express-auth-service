import '@/config/env.js';
import express from 'express';
import authRoutes from './features/auth/auth.route.js';
import { logger, httpLogger } from './infrastructure/logger/logger.js';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from '@/app/middlewares/error.middleware.js';
import { connectDB } from '@/infrastructure/database/mongoose.js';

await connectDB();

const app = express();
app.use(httpLogger);
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
