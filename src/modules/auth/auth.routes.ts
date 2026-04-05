import { Router } from 'express';
import { validate } from '@/app/middlewares/validate.middleware.js';
import { authController } from '@/modules/auth/auth.controller.js';
import { authenticate } from '@/modules/auth/auth.middleware.js';
import { loginSchema, registerSchema } from '@/modules/auth/auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;
