import { Router } from "express";

import { login } from "@/features/auth/auth.controller";

const router = Router();

router.post("/login", login);

export default router;
