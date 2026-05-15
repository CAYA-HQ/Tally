import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as userService from "../service/user.service";
import * as jwt from "../utils/jwt";
import type { Request, Response } from "express";
import { redis } from "../config/redis";
import { env } from "../model/validate.user";
import { getFullDate, getTime } from "../utils/date";
import { buildMetaData } from "../utils/metaDataArg";
import { asyncHandler } from "../utils/asyncHandler";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
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
            isVerified: true,
            metadata: {
              session: [],
              registrationDate: getFullDate(new Date()),
              registrationTime: getTime(new Date()),
            },
          } as any);
        }

        else {
          await userService.updateUserById(user.id, {
            googleId: profile.id,
            authProvider: "google",
            isVerified: true,
          } as any);
          user = await userService.getUserByEmail(email);
        }

        return done(null, user as any);
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);

export const googleVerification = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = passport.authenticate("google", {
  failureRedirect: "/login",
  session: false,
});

export const googleSession = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
  const {ip, parser} = buildMetaData(req)
  const metaData = await userService.metaDataInfo(ip, parser)

  user.metadata.fingerprint.push(metaData.fingerprint)
  user.metadata.session.push(metaData.session);

  await user.save();

  const payload = {
    id: user.id,
    email: user.email,
  };

  const accessToken = jwt.genAccessToken(payload);
  const refreshToken = await jwt.generateRefreshToken(res, payload);

  await redis.set(`refresh:${user.id}`, refreshToken, {
    EX: 60 * 60 * 24 * 7,
  });

  return res.json({
    success: true,
    accessToken,
    user: payload,
  });
})