import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { env } from "../model/validate.user";
import { transporter } from "../service/otp.service";
import { Alert } from "../model/Reminders.model";
import { io } from "./socket";
import { setNotification } from "../service/notification.service";


export const ioRedis = new IORedis({
  host: 'redis',
  port: Number(env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

const workerConnection = new IORedis({
  host: 'redis',
  port: Number(env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

export const ReportsConnection = new IORedis({
  host: 'redis',
  port: Number(env.REDIS_PORT),
  maxRetriesPerRequest: null,
});


export const emailQueue = new Queue("emailQueue", {
  connection: ioRedis,
});

new Worker(
  "emailQueue",
  
  async (job: any) => {

    const {
      alertId,
      email,
      title,
      note,
      userId,
      mode,
      date,
      time,
      frequency,
      weekday,
      monthDay,
      alertAt,
    } = job.data;

    try {
      // 1. Send email
      await transporter.sendMail({
        from: env.GOOGLE_EMAIL,
        to: email,
        subject: title,
        html: `
        <div
          style="
            background: #1E90FF;
            padding: 24px;
            border-radius: 12px;
            font-family: Arial, sans-serif;
            color: white;
          "
        >
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 24px;
          ">
          <h1>TALLY REMINDER SERVICER</h1>
          </div>
          <h2 style="margin-bottom: 12px;">
            Remember To ${title}
          </h2>

          <p style="margin-bottom: 16px;">
            ${note}
          </p>

          ${
            date
              ? `<p><strong>Date:</strong> ${date}</p>`
              :` <p><strong>Date:</strong> Not specified</p>`
          }
        
          ${
            time
              ? `<p><strong>Time:</strong> ${time}</p>`
              : `<p><strong>Time:</strong> Not specified</p>`
          }
        </div>
      `,
      });
      
      // 2. Update DB
      await Alert.findByIdAndUpdate(
        alertId,
        {
          sent: true,
        }
      );

      await setNotification(
        userId,
        job.data,
        `${title} reminder have been sent to your email successfully!`,
        "alert"
      )

      // 3. Notify frontend in real-time
      io.to(userId).emit("alert:sent", {
        alertId,
        title,
        note,
        mode,
        date,
        time,
        sentAt: new Date(),
      });

      console.log("Email sent:", email);
    } catch (err) {
      console.log("Email failed:", err);

      await Alert.findByIdAndUpdate(
        alertId,
        {
          sent: false,
        }
      );

      io.to(userId).emit("alert:failed", {
        alertId,
        title,
        note,
      });

      throw err;
    }
  },

  {
    connection: workerConnection,
  }
);
