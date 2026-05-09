import mongoose from "mongoose";
import {env} from "../model/validate.user";

export const connectDB = async () => {
  try {
    if (!env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // stop app if DB fails
  }
};