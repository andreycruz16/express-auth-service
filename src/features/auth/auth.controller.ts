import type { Request, Response } from "express";
import { success, failure } from "@/shared/utils/response.js";

export const login = (_req: Request, res: Response) => {
  res.json(success({ message: "login works" }));
};
