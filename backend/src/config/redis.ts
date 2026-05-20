import { createClient } from "redis";
import IORedis from "ioredis";
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

export const ioRedis = new IORedis(env.REDIS_URL!);

export const redis = redisClient;   
