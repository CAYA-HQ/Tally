import type { Request, Response } from "express";
import { getFullDate, getTime } from "../utils/date";
import { getUserByEmail } from "../service/user.service";
import * as jwt from "../utils/jwt";

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const otpValue = user.metadata?.otp;
  const otpExpires = user.metadata?.otpExpires;

  if (user.otpLockedUntil && user.otpLockedUntil < new Date()) {
    user.otpLockedUntil = null;
    user.otpAttempts = 0;
    await user.save();
  }

  if (user.otpLockedUntil && user.otpLockedUntil > new Date()) {
    return res.status(403).json({
      success: false,
      message: `Account locked. Try again in ${
        Math.ceil((user.otpLockedUntil.getTime() - Date.now()) / 1000)
      } seconds`,
    });
  }

  if (!otpValue || !otpExpires) {
    return res.status(400).json({
      success: false,
      message: "No OTP found",
    });
  }

  // 7. OTP expiry check
  if (Date.now() > otpExpires) {
    user.metadata.otp = null;
    user.metadata.otpExpires = null;
    await user.save();

    return res.status(400).json({
      success: false,
      message: "OTP has expired",
    });
  }

  if (otpValue !== otp) {
    user.otpAttempts += 1;

    if (user.otpAttempts >= 5 && !user.isVerified) {
      await user.deleteOne();

      return res.status(403).json({
        success: false,
        message: "Too many failed attempts. Please register again.",
      });
    }

    if (user.otpAttempts >= 5) {
      user.otpLockedUntil = new Date(Date.now() + 60 * 1000);
    }

    await user.save();

    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  user.isVerified = true;
  user.otpAttempts = 0;
  user.otpLockedUntil = null;

  user.metadata.otp = null;
  user.metadata.otpExpires = null;

  user.metadata.registrationDate = getFullDate(new Date());
  user.metadata.registrationTime = getTime(new Date());

  await user.save();

  const payload = jwt.payLOad(user);
  const accessToken = jwt.genAccessToken(payload);

  await jwt.generateRefreshToken(res, payload);

  return res.status(200).json({
    success: true,
    message: "Verification successful",
    user: payload,
    accessToken,
  });
};