import { Worker } from "bullmq";
import type { JobsOptions, RepeatOptions } from "bullmq";
import IORedis from "ioredis";
import { transporter } from "./otp.service";
import { Alert } from "../model/alert.model";
import { io } from "../config/socket";
import { env } from "../model/validate.user";
import { emailQueue } from "../config/bullQ";
import { setNotification } from "./notification.service";
import { User } from "../model/User";

const workerConnection = new IORedis({
  host: 'redis',
  port: Number(env.REDIS_PORT),
  maxRetriesPerRequest: null,
});


new Worker(
  "emailQueue",

  async (job) => {
    const {
      alertId,
      email,
      title,
      reminder,
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
          <p>${reminder}</p>
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
        reminder,
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
        reminder,
      });

      throw err;
    }
  },

  {
    connection: workerConnection,
  }
);


// Helper function to build job options based on repeat type

type RepeatType = 
  | "none"
  | "daily"
  | "weekly"
  | "monthly";

interface ReminderOptions {
  alertAt: string;
  repeatType: RepeatType;
  repeatDays?: number[];
  timezone?: string;
}
type ProcessedJobConfig = JobsOptions & {
  repeat?: RepeatOptions;
};

export const jobOptions = (data: ReminderOptions): ProcessedJobConfig => {

  const date = new Date(data.alertAt);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  if (
    data.repeatType === "none" &&
    date.getTime() < Date.now()
  ) {
    throw new Error(
    "Alert time is in the past"
  )}

  const minutes = date.getMinutes();
  const hours = date.getHours();
  const dayOfMonth = date.getDate();

  const timezone = data.timezone || "Africa/Lagos";

  // Base options for all jobs
  const baseOptions: JobsOptions = {
    attempts: 5,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: 1000,
    removeOnFail: 5000,
  };

  // ONE TIME
  if (data.repeatType === "none") {
    return {
      ...baseOptions,

      delay: date.getTime() - Date.now(),
    };
  }

  // DAILY
  if (data.repeatType === "daily") {
    return {
      ...baseOptions,

      repeat: {
        pattern: `${minutes} ${hours} * * *`,
        tz: timezone,
      },
    };
  }

  // WEEKLY
  if (
    data.repeatType === "weekly" &&
    data.repeatDays?.length
  ) {
    return {
      ...baseOptions,

      repeat: {
        pattern: `${minutes} ${hours} * * ${data.repeatDays.join(",")}`,
        tz: timezone,
      },
    };
  }

  // MONTHLY
  if (data.repeatType === "monthly") {
    return {
      ...baseOptions,

      repeat: {
        pattern: `${minutes} ${hours} ${dayOfMonth} * *`,
        tz: timezone,
      },
    };
  }

  return baseOptions;
};


export type reminderData = {
  title: string,
  reminder: string,
  alertAt: string,
  timezone: string,
  repeatType:  "none" | "daily" | "weekly" | "monthly",
  repeatDays?: number[],
  userId: string
}

// Service function to create alert and corresponding job
export const createAlert = async(body: reminderData ) => {
  
  const {
    title,
    reminder,
    alertAt,
    timezone,
    repeatType,
    repeatDays,
    userId,
  } = body;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const options = jobOptions({
  alertAt,
  timezone,
  repeatType,
  repeatDays,
  });


  const alert = await Alert.create({
    userId,
    email: user.email,
    whatsappNumber: user.phone,
    title,
    reminder,
    alertAt,
    timezone,
    repeatType,
    repeatDays,
  });
  const alertId = alert._id
  
  // Set notification for the user
  await setNotification(
    userId,
    {
      alertId,
      title,
      reminder,
      alertAt,
    },
    `Alert "${title}" has been set for ${new Date(alertAt).toLocaleString()}`,
    "alert"
  )

  if (alert.repeatType !== "none") {
    const { repeat, ...baseOptions } = options as ProcessedJobConfig;

    if (!repeat) {
      throw new Error("Missing repeat configuration for alert repeat job");
    }

    const schedulerId = `${alertId}--repeat`

    await emailQueue.upsertJobScheduler(
      schedulerId,
      repeat,
      {
        name: "scheduled-email",
        data: {
          alertId,
          userId,
          email: user.email,
          title,
          reminder,
        },
        opts: baseOptions,
      }
    );

    alert.jobId = schedulerId;

  } else {

    const job = await emailQueue.add(
      "scheduled-email",
      {
        alertId,
        userId,
        email: user.email,
        title,
        reminder,
      },
      options
    );

    alert.jobId = job.id as string;
  }
  
  await alert.save();

  // set notification for alert creation
  await setNotification(
    userId,
    {
      alertId,
      title,
      reminder,
      alertAt,
    },
    `Alert "${title}" has been emailed successfully!`,
    "alert"
  )
  return {
    alert,
  };

}

// Service function to delete alert job
export const removeAlertJob = async (alert: any, jobId: string, userId: string) => {
  const alertId = alert._id
  try {
  
      if (alert.repeatType === "none") {

        const job = await emailQueue.getJob(jobId);
        if (job) await job.remove();

      } else {
        await emailQueue.removeJobScheduler(jobId);
      }
      
    } catch (err) {
      console.log(
        "Job deletion error:",
        err
      );
    }
  
    await setNotification(
      userId,
      alertId,
      `Your alert "${alert.title}" has been deleted successfully`,
      "Alert Deleted"
    );
}
