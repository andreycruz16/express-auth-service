import { Request, Response } from "express";
import { success } from "@/shared/utils/response.js";
import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await registerUser(email, password);

  res.json(success(user));
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const data = await loginUser(email, password);

  res.json(success(data));
};