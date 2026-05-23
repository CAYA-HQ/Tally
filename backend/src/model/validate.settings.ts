import { z } from "zod";

export const updateNotificationSchema = z.object({
  email_notifications: z.object({
    news_and_updates: z.boolean(),
    tips_and_tutorials: z.boolean(),
    reminders: z.boolean(),
  }),
  push_notifications: z.object({
    comments: z.boolean(),
    reminders: z.boolean(),
  }),
  alertMode: z.boolean(),
  dailyReminder: z.boolean(),
  toWhatsapp: z.boolean(),
  toEmail: z.boolean(),
  stockStatus: z.boolean(),
});

export type UpdateNotificationPayload = z.infer<typeof updateNotificationSchema>;
