import type { Request, Response, NextFunction } from "express";
import * as jwt from "../utils/jwt";

export const verifyUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1] as string;

  try {
    const decoded = jwt.verifyRefreshToken(token);

    (req as any).user = decoded;

    next();
  } catch {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};