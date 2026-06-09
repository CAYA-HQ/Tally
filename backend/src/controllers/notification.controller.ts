import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Notification } from "../model/notification.model";
import * as notificationService from "../service/notification.service";
import { getUserId } from "../utils/getUserId";

// Get notifications with pagination
export const getNotification: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { cursor } = req.query;
    const userId = getUserId(req)

    const notifications = await Notification.find({
      userId,
      _id: cursor ? { $lt: cursor } : { $exists: true },
    }).sort({ _id: -1 }).limit(20);

    const nextCursor =
      notifications.length === 20
        ? notifications[notifications.length - 1]?._id
        : null;
    const hasMore = notifications.length === 20;

    res.status(200).json({
      notifications,
      nextCursor,
      hasMore,
    });
  },
);


// Mark a notification as read
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = getUserId(req)
  
  await notificationService.markAsRead(userId, id as string);
  res.status(200).json({ message: "Notification marked as read" });
});


// Mark all notifications as read
export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {

    const userId = getUserId(req)

    const notifications = await notificationService
    .markAllAsRead(userId);

    res.status(200).json({ 
      message: "All notifications marked as read",
      notifications
    });
  },
);


// Delete a notification
export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req)
    await notificationService.deleteNotification(userId, id as string);
    res.status(200).json({ message: "Notification deleted" });
  },
);


// Delete all notifications
export const deleteAllNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req)
    await notificationService.deleteAllNotification(userId);
    res.status(200).json({ message: "All notifications deleted" });
  },
);
