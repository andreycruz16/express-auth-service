import type { NextFunction, Request, Response } from 'express';
import { env } from '@/config/env.js';
import { logger } from '@/infrastructure/logger.js';
import { AppError } from '@/shared/app-error.js';

const isProduction = env.NODE_ENV === 'production';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const isAppError = err instanceof AppError;
  const isKnownError = err instanceof Error;

  const status = isAppError ? err.status : 500;

  const message = isProduction
    ? (isAppError ? err.message : 'Internal Server Error')
    : (isKnownError ? err.message : 'Unknown error');

  logger.error(
    {
      err,
      status,
      ...(isKnownError ? { stack: err.stack } : {}),
    },
    'Request failed'
  );

  res.status(status).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: isKnownError ? err.stack : undefined }),
  });
}