//Importing necessary modules and services
import type { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { asyncHandler } from "../utils/asyncHandler";
import * as userService from "../service/user.service";
import * as jwt from "../utils/jwt";
import { redis } from "../config/redis";
import { sendOtp } from "../service/otp.service";
import { buildMetaData } from "../utils/metaDataArg";

//Controller for handling user registration
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and password are required",
    });
  }
  const { ip, parser } = buildMetaData(req);
  const metaData = await userService.metaDataInfo(ip, parser);

  const hashedPassword = await hashPassword(password);

  const newUser = await userService.createUser({
    name,
    email,
    password: hashedPassword,
  });
  newUser.isVerified = false;

  newUser.metadata.session = newUser.metadata.session || [];
  newUser.metadata.session.push(metaData.session);

  newUser.metadata.fingerprint = newUser.metadata.fingerprint || [];
  newUser.metadata.fingerprint.push(metaData.fingerprint);
  await newUser.save();

  await sendOtp(email, newUser);

  return res.status(200).json({
    success: true,
    message: "Account created. OTP sent to email.",
    email: email,
  });
});

//Controller for handling user login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await userService.getUserByEmail(email);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await comparePassword(password, user.password as string);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  if (!user.isVerified) {
    await sendOtp(email, user);
    return res.status(403).json({
      success: false,
      message: "Account not verified. OTP sent to email.",
      email: email,
    });
  }

  const payload = jwt.payLOad(user);
  const accessToken = jwt.genAccessToken(payload);
  await jwt.generateRefreshToken(res, payload);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    user: payload,
  });
});

//Controller for handling user logout
export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const decoded = jwt.verifyRefreshToken(token);
  await redis.del(`refresh:${decoded.id}`);
  jwt.logOutUser(res, token);
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
  if (!stored || stored !== token) {
    await redis.del(`refresh:${userId}`);

    return res.status(403).json({
      message: "Session compromised. Login again.",
    });
  }
  const payload = jwt.payLOad(decoded);
  const newAccessToken = jwt.genAccessToken(payload);
  await jwt.generateRefreshToken(res, payload);

  return res.json({
    accessToken: newAccessToken,
  });
});
