import type { Request, Response } from "express";
import { getUserByEmail } from "../service/user.service";
import * as jwt from "../utils/jwt";
import * as OTP from '../service/otp.service'
import { setNotification } from '../service/notification.service'
import { createAlert, type noteData } from "../service/alertWorker.service";
import { asyncHandler } from "../utils/asyncHandler";


export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (user.isVerified) {
    return res.status(409).json({
      success: false,
      message: "Account already verified",
    });
  }

  await OTP.sendOtp(email, user);

  return res.status(200).json({
    success: true,
    message: "OTP sent to email.",
    email,
  });
});


export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, timezone } = req.body;

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

  user.metadata = user.metadata || {};
  if (!user.metadata.onBoarding) user.metadata.onBoarding = [];
  if (!user.metadata.timezone) user.metadata.timezone = timezone || 'UTC';

  await OTP.clearOtp(email);

  if (user.isVerified) {
    await user.save();
    
    await setNotification(user.id, `Welcome back ${user.name} 🎉`, 'login', '')
    console.log(`User logged in: ${user.email}`)

  } else {
    user.isVerified = true;
    await user.save();
    console.log(`User verified: ${user.email}`)
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 1);
    reminderDate.setHours( 20, 0, 0, 0);

    // const dailyReminderData: noteData = {
    //   userId: user.id,
    //   title: "Daily Reminder",
    //   note: "Don't forget to log your expenses in Tally today!",
    //   alertAt: reminderDate.toISOString(),
    //   frequency: "daily",
    //   timezone: timezone,
    //   repeatType: "daily",
    // }

    // try {
    //   await createAlert(dailyReminderData)
    //   console.log(`Daily reminder set for user: ${user.email}`)
    // } catch (error) {
    //   console.error("Failed to create daily reminder:", error);
    // }

    await setNotification(user.id, `Welcome onboard ${user.name} 🎉`, 'signup', '')
  }

  if(!user.phone || user.metadata.onBoarding.length === 0){
    await setNotification(user.id, 'Complete onboarding to get started', 'login', '')
  }

  const safeAvatar = user.avatar ?? { url: '', public_id: '' };
  const payload = jwt.payLoad({ ...user.toObject(), avatar: safeAvatar } as any);
  const accessToken = jwt.genAccessToken(payload);  

  await jwt.generateRefreshToken(res, payload);




  return res.status(200).json({
    success: true,
    message: "Verification successful",
    user: payload,
    accessToken,
  });
});
