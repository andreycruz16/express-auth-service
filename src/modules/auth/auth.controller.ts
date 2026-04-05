import type { Request, Response } from 'express';
import { authService } from '@/modules/auth/auth.service.js';
import { success } from '@/shared/response.js';
import type { AuthenticatedRequest } from '@/modules/auth/auth.types.js';
import { AppError } from '@/shared/app-error.js';

export const authController = {
  async register(req: Request, res: Response) {
    const user = await authService.register(req.body);
    res.status(201).json(success(user));
  },

  async login(req: Request, res: Response) {
    const data = await authService.login(req.body);
    res.json(success(data));
  },

  async refresh(req: Request, res: Response) {
    const data = await authService.refresh(req.body);
    res.json(success(data));
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.body);
    res.json(success({ message: 'Logged out successfully' }));
  },

  async getMe(req: Request, res: Response) {
    const auth = (req as AuthenticatedRequest).auth;

    if (!auth) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await authService.getMe(auth.userId);
    res.json(success(user));
  },
};
