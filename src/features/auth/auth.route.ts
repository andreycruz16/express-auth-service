import { Router } from 'express';
import { validate } from "@/app/middlewares/validate.middleware.js";
import { login, register } from '@/features/auth/auth.controller.js';
import { loginSchema, registerSchema } from "./auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;