import { Worker } from "bullmq";
import { ioRedis } from "../config/redis";
import { transporter } from "./otp.service";
import { Alert } from "../model/alert.model";
import { io } from "../config/socket";
import { env } from "../model/validate.user";

new Worker(
  "emailQueue",

  async (job) => {
    const {
      alertId,
      email,
      title,
      message,
      userId,
    } = job.data;

    try {
      // 1. Send email
      await transporter.sendMail({
        from: env.GOOGLE_EMAIL,
        to: email,
        subject: title,
        html: `
          <h2>${title}</h2>
          <p>${message}</p>
        `,
      });

      // 2. Update DB
      await Alert.findByIdAndUpdate(
        alertId,
        {
          status: "sent",
        }
      );

      // 3. Notify frontend in real-time
      io.to(userId).emit("alert:sent", {
        alertId,
        title,
        message,
        sentAt: new Date(),
      });

      console.log("Email sent:", email);
    } catch (err) {
      console.log("Email failed:", err);

      await Alert.findByIdAndUpdate(
        alertId,
        {
          status: "failed",
        }
      );

      io.to(userId).emit("alert:failed", {
        alertId,
        title,
      });
    }
  },

  {
    connection: ioRedis,
  }
);