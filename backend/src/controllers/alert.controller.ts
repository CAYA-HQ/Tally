import type { Request, Response } from "express";
import { emailQueue } from "../config/bullQ";
import { Alert } from "../model/alert.model";
import { asyncHandler } from "../utils/asyncHandler";

    type body = {
      title: string,
      reminder: string,
      hour: string,
      minute: string,
      dayOfWeek: string,
      timezone: string,
      user: any
    }

export const createAlert = asyncHandler(async (body: body ) => {

  const alertAt = `${body.minute} ${body.hour} * * ${body.dayOfWeek}`;
  const title = body.title
  const reminder = body.reminder

  // 1. Save to DB first
  const alert =
    await Alert.create({
      userId: body.user._id,
      email: body.user.email,
      title,
      reminder,
      alertAt,
    });

  // 2. Create job in Redis
  const job = await emailQueue.add(
    "scheduled-email",
    {
      alertId: alert._id,
      userId: body.user._id,
      email: body.user.email,
      title,
      reminder,
    },
    {
      repeat: {
        pattern: alertAt,
        tz: body.timezone || "Africa/Lagos",
      },
    }
  );

  // 3. Save jobId
  alert.jobId = job.id as string;
  await alert.save();

})

