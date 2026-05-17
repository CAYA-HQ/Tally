import { Notification } from "../model/notification.model";
import { io } from "../config/socket";

export const setNotification = async ( userId: string, data: any, message: string, category: string ) => {
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