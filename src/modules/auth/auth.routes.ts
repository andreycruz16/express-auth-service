import { Router } from 'express';
import { validate } from '@/app/middlewares/validate.middleware.js';
import { authController } from '@/modules/auth/auth.controller.js';
import { authenticate } from '@/modules/auth/auth.middleware.js';
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
  resendVerificationSchema,
} from '@/modules/auth/auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/logout', validate(logoutSchema), authController.logout);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', validate(resendVerificationSchema), authController.resendVerification);
router.get('/me', authenticate, authController.getMe);

export default router;
