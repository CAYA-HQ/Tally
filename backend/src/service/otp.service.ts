import nodemailer from "nodemailer";
import { env } from "../model/validate.user";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.GOOGLE_EMAIL,
      pass: env.GOOGLE_PASSWORD,
    },
});

export const mailOptions = (otp: any, email: string)=> ({
    from: env.GOOGLE_EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
})

export const sendOtp = async (email: string, user: any) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  if (user.isVerified) {
    throw new Error("User already verified");
  }

  user.metadata = user.metadata || {};

  user.metadata.otp = otp;
  user.metadata.otpExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  await transporter.sendMail(mailOptions(otp, email));

  return otp;
};

