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

export const getMe = async (req: Request, res: Response) => {
  const user = (req as Request & { user?: any }).user;

  res.json(success(user));
};