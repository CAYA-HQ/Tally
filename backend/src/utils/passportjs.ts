import dotenv from "dotenv";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { getUserById } from "../service/user.service";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => req?.cookies?.token,
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await getUserById(payload.id);

      if (!user) return done(null, false);

      return done(null, user); // attaches to req.user
    } catch (err) {
      return done(err, false);
    }
  })
);

export const verifyUser = passport.authenticate("jwt", { session: false });


