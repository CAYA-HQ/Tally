//Importing necessary modules and services
import type { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { asyncHandler } from "../utils/asyncHandler";
import * as userService from "../service/user.service";
import * as jwt from '../utils/jwt'
import { redis } from "../config/redis";


//Controller for handling user registration
export const register = asyncHandler(async (req: Request, res: Response) => {
        const { name, email, phone, password } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({
            success: false,
            message: "Name, email, phone and password are required"
        })
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await userService.createUser({ name, email, phone, password: hashedPassword });
    const payload = jwt.payLOad(newUser);
    const accessToken = jwt.genAccessToken(payload);
    jwt.generateRefreshToken(res, payload);
    res.status(201).json({
        success: true,
        message: 'new user created successfully',
        newUser,
        accessToken,
    })
})



//Controller for handling user login
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        })
    }

    const isMatch = await comparePassword(password, user.password as string);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        })
    }
    const payload = jwt.payLOad(user);
    const accessToken = jwt.genAccessToken(payload);
    jwt.generateRefreshToken(res, payload);
    res.status(200).json({
        success: true,
        message: 'login successful',
        accessToken,
        user,
    })
})


//Controller for handling user logout
export const logout = (req: Request, res: Response) => {
    const token = req.cookies.token;
    jwt.logOutUser(res, token);
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
};


//Controller for handling token refresh
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  let decoded;

  try {
    decoded = jwt.verifyRefreshToken(token);
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }

  const userId = decoded.id;

  const stored = await redis.get(`refresh:${userId}`);

  //REUSE DETECTION
  if (!stored || (stored !== token)) {
    await redis.del(`refresh:${userId}`);

    return res.status(403).json({
      message: "Session compromised. Login again.",
    });
  }

  const newAccessToken = jwt.genAccessToken({ id: userId });
  const newRefreshToken = await jwt.generateRefreshToken(res,{ id: userId });

  await redis.set(`refresh:${userId}`, newRefreshToken, {
    EX: 60 * 60 * 24 * 7,
  });

  res.cookie("token", newRefreshToken, jwt.cookieOption);

  return res.json({
    accessToken: newAccessToken,
  });
});