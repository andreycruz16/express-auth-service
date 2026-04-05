import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export const validate =
  <T>(schema: z.ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: result.error.flatten(),
      });
    }

    req.body = result.data;
    next();
  };
