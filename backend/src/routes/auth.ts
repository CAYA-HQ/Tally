import { Router } from "express";
import { login, register, logout, refresh } from "../controllers/auth.controller";
import { googleVerification, googleCallback, googleSession } from "../utils/passportStrategy/googleStrategy";

const authRouter = Router();

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/refresh', refresh)
authRouter.get('/google', googleVerification)
authRouter.get ('/google/callback', googleCallback, googleSession)

export default authRouter;


