import nodemailer from "nodemailer";
import { env } from "../model/validate.user";
import {redis} from "../config/redis";

//google mail services
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.GOOGLE_EMAIL,
      pass: env.GOOGLE_PASSWORD,
    },
});

//google mail services options
export const mailOptions = (otp: any, email: string)=> ({
    from: env.GOOGLE_EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
})

//send otp
export const sendOtp = async (email: string, user: any) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  if (user.isVerified) {
    throw new Error("User already verified");
  }

  await redis.set(`otp:${email}`, otp, {
    EX: 300, 
  });

  await redis.set(`otpAttempts:${email}`, "0", {
    EX: 600,
  });

  await transporter.sendMail(mailOptions(otp, email));

  return otp;
};

// get stored otp
export const getOtp = async (email: string) => {
  return await redis.get(`otp:${email}`);
};

// clear otp
export const clearOtp = async (email: string) => {
  await redis.del(`otp:${email}`);
  await redis.del(`otpAttempts:${email}`);
};

// otp attempt increase
export const incrementAttempts = async (email: string) => {
  const key = `otpAttempts:${email}`;

  const attempts = await redis.incr(key);

  if (attempts === 1) {
    await redis.expire(key, 600);
  }

  return attempts;
};

//lock user
export const lockUser = async (email: string) => {
  await redis.set(`otpLock:${email}`, "1", {
    EX: 60,
  });
};

//checking locked user
export const isLocked = async (email: string) => {
  return await redis.get(`otpLock:${email}`);
};