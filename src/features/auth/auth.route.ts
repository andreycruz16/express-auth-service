import { Router } from 'express';
import { validate } from "@/app/middlewares/validate.middleware.js";
import { login, register, getMe } from '@/features/auth/auth.controller.js';
import { loginSchema, registerSchema } from "./auth.schema.js";
import { protect } from "./auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);

export default router;