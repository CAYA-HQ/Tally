import type { JobsOptions, RepeatOptions } from "bullmq";
import { emailQueue } from "../config/bullMQ";
import { setNotification } from "./notification.service";


// Helper function to build job options based on repeat type

const daysOfTheWeek = ['Sunday' ,'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

type frequency =   "none" | "daily" | "weekly" | "monthly";

interface noteOptions {
  alertAt: string;
  frequency: frequency;
  weekday?: string;
  monthDay?: number;
  timezone?: string;
  startDate?: Date;
}

type ProcessedJobConfig = JobsOptions & {
  repeat?: RepeatOptions;
};

// Service function to create alert job
export const jobOptions = (data: noteOptions): ProcessedJobConfig => {
  if(!data) return {};
  const date = new Date(data.alertAt);

  if (isNaN(date.getTime())) throw new Error("Invalid date");

  const minutes = date.getMinutes();
  const hours = date.getHours();
  const timezone = data.timezone || "UTC";

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
  if (data.frequency === "none") {
    const now = Date.now();
    const target = Date.parse(data.alertAt);
    
    if (isNaN(target)) {
      throw new Error("Invalid alertAt format");
    }
    console.log({
  currentUTC: new Date().toISOString(),
  alertUTC: data.alertAt,
});
    const delay = target - now;

    if (delay <= 0) {
      console.log({
        'date': date,
        'alertAt': data.alertAt,
        'now': now,
        'target': target.toLocaleString(),
        delay
      })
      throw new Error("alertAt must be in the future");
    }
    
    return {
      ...baseOptions,

      delay: delay,
    };
  }

  // DAILY
  if (data.frequency === "daily") {
    return {
      ...baseOptions,

      repeat: {
        pattern: `${minutes} ${hours} * * *`,
        tz: timezone,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
      },
    };
  }

  // WEEKLY
  if (data.frequency === "weekly") {
    if (!data.weekday) throw new Error("Weekly repeat requires weekday");
    
    const weekDay = daysOfTheWeek.indexOf(data.weekday)
    if(weekDay === -1) throw new Error("Invalid weekday value for weekly repeat");

    return {
      ...baseOptions,

      repeat: {
        pattern: `${minutes} ${hours} * * ${weekDay}`,
        tz: timezone,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
      },
    };
  }

  // MONTHLY
  if (data.frequency === "monthly") {
    if (data.monthDay === undefined) throw new Error("Monthly repeat requires monthDay");

    return {
      ...baseOptions,

      repeat: {
        pattern: `${minutes} ${hours} ${data.monthDay} * *`,
        tz: timezone,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
      },
    };
  }

  return baseOptions;
};


// Service function to create alert and corresponding job
export type noteData = {
  title: string,
  note: string,
  alertAt: string,
  timezone: string,
  userId: string,
  alertMode?: ("whatsapp" | "email" | "push")[],
  date?: string,
  time?: string,
  mode?: "One-time" | "Recurring",
  frequency?: frequency,
  weekday?: string,
  monthDay?: number,
  startDate?: Date,
  alertId: string,
}

// Service function to create alert and corresponding job
const Alertdata = (d: any )=> {return {
  alertId: d.alertId,
  userId: d.userId,
  email: d.email,
  title: d.title,
  note: d.note,
  mode: d.mode,
  date: d.date,
  time: d.time,
  frequency: d.frequency,
  weekday: d.weekday,
  monthDay: d.monthDay,
  alertAt: d.alertAt,
}}


// Service function to reschedule alert job
export const reScheduleAlertJob = async (alert: any) => {
  const options = jobOptions({
    alertAt: alert.alertAt,
    timezone: alert.timezone,
    frequency: alert.frequency,
    weekday: alert.weekday,
  });

  if (alert.frequency !== "none") {
    const { repeat, ...baseOptions } = options as ProcessedJobConfig;
    if (!repeat) throw new Error("Missing repeat configuration for alert repeat job");
      
    const schedulerId = `${alert._id}--repeat`;

    await emailQueue.upsertJobScheduler(
      schedulerId,
      repeat,
      {
        name: "scheduled-email",
        data: Alertdata(alert),
        opts: baseOptions,
      }
    );

    alert.jobId = schedulerId;
  } else {
    const job = await emailQueue.add(
      "scheduled-email",
      Alertdata(alert),
      options
    );

    alert.jobId = job.id as string;
  }
  alert.sent = false;

  await alert.save();

  return alert;
};

// Service function to create alert and corresponding job
export const createAlert = async(alert: noteData ) => {
  
  const {
    title, note, alertAt, timezone, userId, alertMode, date,
    time, mode, frequency = "none", weekday, monthDay, alertId,
  } = alert;

  const options = jobOptions({
    alertAt, timezone, frequency, weekday,
  });

  let jobId

  if (frequency !== "none") {
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
        data: Alertdata(alert),
        opts: baseOptions,
      }
    );
    jobId = schedulerId

  } else {

    const job = await emailQueue.add(
      "scheduled-email",
      Alertdata(alert),
      options
    );
    jobId = job.id
  }

  return jobId
}

// Service function to delete alert job
export const removeAlertJob = async (alert: any, jobId: string, userId: string) => {
  const alertId = alert._id
  try {
  
      if (alert.frequency === "none") {

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
