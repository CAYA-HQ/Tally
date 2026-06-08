import {env} from "../model/validate.user";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import { redis } from "../config/redis";


const JWT_SECRET = env.JWT_SECRET
const REFRESH_JWT_SECRET = env.REFRESH_JWT_SECRET

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

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET as string) as any;
  } catch (err) {
    return null;
  }
}

export const cookieOption = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "none" as const,
}

export const generateRefreshToken = async (res: Response, payload: object): Promise<string> => {
  const token = genRefreshToken(payload);
  res.cookie("token", token, cookieOption); 
  await redis.set(`refresh:${(payload as { id: string }).id}`, token, {
    EX: 60 * 60 * 24 * 7,
  });
  return token;
}

type payLoadType = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: { url: string; public_id: string; } | any;
  session?: Array<any>;
  registrationDate?: string;
  registrationTime?: string;
  metadata?: {
    session?: Array<any>;
    registrationDate?: string;
    registrationTime?: string;
  };
};

export const payLoad = (d: payLoadType) => {
  return {
    id: d?.id,
    name: d?.name,
    email: d?.email,
    phone: d?.phone,
    avatar: d?.avatar,
    session: d.metadata?.session ?? d.session ?? [],
    registrationDate: d.metadata?.registrationDate ?? d.registrationDate,
    registrationTime: d.metadata?.registrationTime ?? d.registrationTime
  }
}

export const logOutUser = async (res: Response, token: string) => {
    if (!token) return;

    try {
      const decoded = verifyRefreshToken(token);
      await redis.del(`refresh:${decoded.id}`);
    } catch {}
  
    res.clearCookie("token", cookieOption as object)

}
