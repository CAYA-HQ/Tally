//Import necessary modules and types
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as userService from "../../service/user.service";
import * as jwt from "../jwt"
import type { Request, Response } from "express";
import { redis } from "../../config/redis";


//Configure the Google OAuth strategy for Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;

    if (!email) {
      return done(new Error("No email from Google"), false);
    }

    let user = await userService.getUserByEmail(email);

    if (!user) {
      user = await userService.createUser({
        name,
        email,
        googleId: profile.id,
        authProvider: "google",
      } as any);
    } else if (!user.googleId) {
      user = await userService.updateUser(user.id, {
        googleId: profile.id,
        authProvider: "google",
      } as any);
    }

    return done(null, user as any);
  } catch (err) {
    return done(err as Error, false);
  }
  }));


//Export middleware for Google authentication and callback handling
export const googleVerification = passport.authenticate("google", { scope: ["profile", "email"] });

//Callback route handler for Google authentication
export const googleCallback = passport.authenticate("google", {
  failureRedirect: "/login",
  session: false,
});


//Session handler for successful Google authentication
export const googleSession = async (req: Request, res: Response) => {
  const user = req.user as { id: string; email: string };

  const accessToken = jwt.genAccessToken({
    id: user.id,
    email: user.email,
  });

  const refreshToken = await jwt.generateRefreshToken(res, {
    id: user.id,
  });

  await redis.set(`refresh:${user.id}`, refreshToken, {
    EX: 60 * 60 * 24 * 7,
  });

  return res.json({
    success: true,
    accessToken,
  });
};
