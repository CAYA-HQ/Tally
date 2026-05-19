import type { Request, Response } from "express";
import { getFullDate, getTime } from "../utils/date";
import { getUserByEmail } from "../service/user.service";
import * as jwt from "../utils/jwt";
import * as OTP from '../service/otp.service'
import { setNotification } from '../service/notification.service'


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

  const now = new Date();
  const storedOtp = await OTP.getOtp(email)
  const locked = await OTP.isLocked(email);

  if (locked) {
    return res.status(403).json({
      success: false,
      message: "Too many attempts. Try again later.",
    });
  }

  if (!storedOtp) {
    return res.status(400).json({
      success: false,
      message: "No OTP found",
    });
  }


  if (!storedOtp || String(storedOtp)!== String(otp)) {
    const attempt = await OTP.incrementAttempts(email)

    if (attempt >= 5 && !user.isVerified) {
      await user.deleteOne();

      return res.status(403).json({
        success: false,
        message: "Too many failed attempts. Please register again.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  if (!user.metadata.notification) user.metadata.notification = [];
  if (!user.metadata.onboarding) user.metadata.onboarding = [];

  await OTP.clearOtp(email);

  if (user.isVerified) {

    setNotification(user.id, `Welcome back ${user.name} 🎉`, 'login')

    if(!user.phone || user.metadata.onBoarding === 0){
      setNotification(user.id, 'Complete onboarding to get started', 'login')
    }

  } else {
    user.isVerified = true; 

    if (!user.metadata.registrationDate || !user.metadata.registrationTime) {
      user.metadata.registrationDate = getFullDate(now);
      user.metadata.registrationTime = getTime(now);
    } 
    setNotification(user.id, `Welcome onboard ${user.name} 🎉`, 'signup')
    
  } 

  await user.save();  

  const payload = jwt.payLoad(user);
  const accessToken = jwt.genAccessToken(payload);  

  await jwt.generateRefreshToken(res, payload); 

  return res.status(200).json({
    success: true,
    message: "Verification successful",
    user: payload,
    accessToken,
  });
}