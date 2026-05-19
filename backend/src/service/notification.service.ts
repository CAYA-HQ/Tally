import { Notification } from "../model/notification.model";
import { io } from "../config/socket";

export const setNotification = async ( userId: string,message: string,category: string ) => {
  // save notification
  const notification = await Notification.create({
    userId,
    message,
    category,
  });

  // realtime emit
  io.to(userId).emit(
    "notification:new",
    notification
  );

  return notification;
};