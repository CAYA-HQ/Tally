import { createClient } from "redis";
import { env } from "../model/validate.user";

const redisClient = createClient({
  url: env.REDIS_URL
});
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
}


export const redis = redisClient;   
