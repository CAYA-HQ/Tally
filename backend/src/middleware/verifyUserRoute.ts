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

  const decoded = jwt.verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  (req as any).user = decoded;

  next();
};
