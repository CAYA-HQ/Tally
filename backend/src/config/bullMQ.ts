import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { env } from "../model/validate.user";
import { transporter } from "../service/otp.service";
import { Alert } from "../model/Reminders.model";
import { io } from "./socket";
import { setNotification } from "../service/notification.service";
import { getUserById } from "../service/user.service";
import { whatsappAlert } from "../service/whatsapp.service";


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
          <h1>TALLY REMINDER SERVICES</h1>
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
      const alert = await Alert.findByIdAndUpdate(
        alertId,
        {sent: true},
        {returnDocument: "after"}
      );

      if(!alert) {
        console.log("Alert not found for ID:", alertId);
        return null;
      }

      console.log('alert sent: ', alert)

      const user = await getUserById(userId);
      if(!user) {
        console.log("User not found for ID:", userId);
        return null;
      }

      // 3. Notify frontend in real-time for push notification
      if(user?.alertMode.includes("push")) {
        console.log('push alert: ',user?.alertMode)
        io.to(userId).emit("alert:sent", {
          alertId,
          title,
          note,
          mode,
          date,
          time,
          sentAt: new Date(),
        });
        console.log('push alert sent')
      }

      // 4 Set whatsapp notification for the alert if enabled
      if(user?.alertMode.includes("whatsapp")) {

        console.log('whatsapp alert: ',user?.alertMode)
        const userName = user.name || "User";
        const countryCode = user.countryCode || "+234";
        const jid = user.phone as string;
        const message = `
         👋 Hello ${userName}, this is *Tally*.

        A quick reminder 🔔 to *${title}*.

        Note: ${note}`.trim();

        await whatsappAlert(jid, countryCode, message.trim());
        console.log('alert sent to whatsapp')
      }
      
      await setNotification(
        userId,
        job.data,
        `${title} reminder have been sent to your ${user.alertMode} successfully!`,
        "alert"
      )

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
