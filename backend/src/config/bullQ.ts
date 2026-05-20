import { Queue } from "bullmq";
import { ioRedis } from "./redis";

export const emailQueue = new Queue("emailQueue", {
  connection: ioRedis,
});