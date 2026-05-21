import { User } from "../model/User";
import { addToMetaData } from "./user.service";

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return null;
  return user.metadata;
};

export const updateProfile = async (
  userId: string,
  updateData: Record<string, any>,
) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  return user;
};

export const getNotifications = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) return null;
  return user.metadata.notifications;
};

export const updateNotifications = async (
  userId: string,
  updateData: Record<string, any>,
) => {
  // updateData = {email_notifications: {news_and_updates: true, tips_and_tutorials: true, reminders: true}, push_notifications: {comments: true, reminders: true}}
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
