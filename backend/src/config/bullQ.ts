import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "../model/validate.user";

const ioRedis = new IORedis({
  host: 'redis',
  port: Number(env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

export const emailQueue = new Queue("emailQueue", {
  connection: ioRedis,
});