import type { NextFunction, Request, Response } from 'express';
import { authService } from '@/modules/auth/auth.service.js';
import type { AuthenticatedRequest } from '@/modules/auth/auth.types.js';
import { AppError } from '@/shared/app-error.js';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new AppError('Missing token', 401);
    }

    const auth = await authService.authenticate(token);
    (req as AuthenticatedRequest).auth = auth;

    next();
  } catch (error) {
    next(error);
  }
};
