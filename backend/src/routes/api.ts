import { Router } from "express";
import authRouter from "./auth";
import UserRouter from "./userRouter";

const api = Router();

api.use("/auth", authRouter)

api.use('/user', UserRouter)

export default api;


