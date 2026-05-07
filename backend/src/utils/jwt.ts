import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import { redis } from "../config/redis";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET
const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET

export const genAccessToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: "15m" });
}

const genRefreshToken = (payload: object): string => {
  return jwt.sign(payload, REFRESH_JWT_SECRET as string, { expiresIn: "7d" });
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_JWT_SECRET as string) as any;
  } catch (err) {
    return null;
  }
}

export const cookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
}

export const generateRefreshToken = async (res: Response, payload: object): Promise<string> => {
  const token = genRefreshToken(payload);
  res.cookie("token", token, cookieOption); 
  await redis.set(`refresh:${(payload as { id: string }).id}`, token, {
    EX: 60 * 60 * 24 * 7,
  }); // Store in Redis with expiration
  return token;
}

type payLoadType = { id: string; name: string; email: string };

export const payLOad = (d: payLoadType) => {
  return {id: d.id, name: d.name, email: d.email}
}

export const logOutUser = async (res: Response, token: string) => {
    if (!token) return;

    try {
      const decoded = verifyRefreshToken(token);
      await redis.del(`refresh:${decoded.id}`);
    } catch {}
  
    res.clearCookie("token", cookieOption as object)

}