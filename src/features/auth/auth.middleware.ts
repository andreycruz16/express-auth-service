import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

type AuthenticatedRequest = Request & {
  user?: Record<string, any>;
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedUser = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as Record<string, any>;

    (req as AuthenticatedRequest).user = decodedUser;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
