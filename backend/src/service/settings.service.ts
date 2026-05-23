import { User } from "../model/User";
import { addToMetaData } from "./user.service";

export const getNotifications = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return null;
  return user.metadata.notifications;
};

export const updateNotifications = async (
  userId: string,
  updateData: Record<string, any>,
) => {
  // {
  //   email_notifications:
  //    {
  //       news_and_updates: bool,
  //       tips_and_tutorials: bool,
  //       reminders: bool
  //     },
  //   push_notifications:
  //     {
  //        comments: bool,
  //        reminders: bool
  //     }
  //   dailyReminder: bool
  //   toWhatsapp: bool
  //   toEmail: bool
  //   stockStatus: bool
  // }

  return await addToMetaData(userId, updateData, "notification");
};

export const get2FA = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return null;
  return user.metadata.allow2fa;
};

export const set2FA = async (userId: string, state: boolean) => {
  return await addToMetaData(userId, state, "allow2fa");
};

// export const updateSecurity = async (
//   userId: string,
//   updateData: Record<string, any>,
// ) => {};

// export const updateBilling = async (
//   userId: string,
//   updateData: Record<string, any>,
// ) => {};
