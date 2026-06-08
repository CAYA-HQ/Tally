import { Notification } from "../model/notification.model";
import { io } from "../config/socket";

export const setNotification = async (
  userId: string,
  data: any,
  message: string,
  category: string,
) => {
  const notification = await Notification.create({
    userId,
    message,
    category,
    data,
  });
  // realtime emit
  io.to(userId).emit(
    "notification:new",
    notification
  );
  return notification;
};

export const markAsRead = async (userId: string, notificationId: string) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true },
  );
};

export const markAllAsRead = async (userId: string) => {
  await Notification.updateMany(
    { userId, read: false },
    { read: true }
  );
  const notifications = await Notification.find({userId})
  io.to(userId).emit(
    "notification:read",
    notifications
  )
  return notifications
};

export const deleteNotification = async (
  userId: string,
  notificationId: string,
) => {
  return await Notification.findOneAndDelete({ _id: notificationId, userId });
};

export const deleteAllNotification = async (userId: string) => {
  return await Notification.deleteMany({ userId });
};
