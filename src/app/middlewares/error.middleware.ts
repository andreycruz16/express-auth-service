import { Request, Response, NextFunction } from 'express';
import { logger } from '@/infrastructure/logger/logger.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const isProd = process.env.NODE_ENV === 'production';

  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof Error) {
    message = err.message;

    // optional: support custom status
    status = (err as any).status || 500;
  }

  logger.error({
    err,
    message,
    status,
  });

  res.status(status).json({
    success: false,
    message: isProd ? 'Internal Server Error' : message,
    ...(isProd ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}
