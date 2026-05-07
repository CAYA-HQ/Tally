import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379"
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
