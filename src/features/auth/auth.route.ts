import { Router } from 'express';
import { login } from '@/features/auth/auth.controller.js';
import { validate } from "@/app/middlewares/validate.middleware.js";
import { loginSchema } from "./auth.schema.js";

const router = Router();
router.post('/login', validate(loginSchema), login);

export default router;
