import type { NextFunction, Request, Response } from 'express';
import { env } from '@/config/env.js';
import { logger } from '@/infrastructure/logger.js';
import { AppError } from '@/shared/app-error.js';

const isProduction = env.NODE_ENV === 'production';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    status = err.status;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  logger.error({ err, status, message }, 'Request failed');

  res.status(status).json({
    success: false,
    message: isProduction ? 'Internal Server Error' : message,
    ...(isProduction ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}
