import dotenv from "dotenv";
import express from "express";
import api from "./routes/api";
import cors from "cors"
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";
import { errorHandler } from "./utils/errorHandler";
import cookieParser from "cookie-parser";
import passport from "passport";
import helmet from "helmet";

dotenv.config();
const app = express();

// helmet used for server protection by setting various HTTP headers
app.use(helmet());

await connectRedis();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(passport.initialize())
app.use(cookieParser());
app.use("/api", api)

//Check endpoint
app.get("/", (req, res) => {
  res.send("API running 🚀");
});
// 404 handler
app.all(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler)

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

