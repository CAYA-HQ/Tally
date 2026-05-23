import { Router } from "express";
import { login, register, logout, refresh } from "../controllers/auth.controller";
import { googleVerification, googleCallback, googleSession } from "../controllers/googleStrategy.controller";
import { resendOtp, verifyOtp } from "../controllers/otp.controller";

const authRouter = Router();

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/refresh', refresh)
authRouter.post('/otp', verifyOtp)
authRouter.post('/otp/resend', resendOtp)
authRouter.get('/google', googleVerification)
authRouter.get ('/google/callback', googleCallback, googleSession)

export default authRouter;
