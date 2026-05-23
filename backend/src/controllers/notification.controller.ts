import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Notification } from "../model/notification.model";
import * as notificationService from "../service/notification.service";
import type { Types } from "mongoose";

interface UserPayload {
  id: Types.ObjectId | string;
  [key: string]: any;
}

export const getNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { cursor } = req.query;
    const userId = (req.user! as any).id;

    const notification = await Notification.find({
      userId,
      _id: cursor ? { $lt: cursor } : { $exists: true },
    })
      .sort({ _id: -1 })
      .limit(20);

    const nextCursor =
      notification.length === 20
        ? notification[notification.length - 1]?._id
        : null;
    const hasMore = notification.length === 20;

    res.status(200).json({
      notification,
      nextCursor,
      hasMore,
    });
  },
);

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user! as any).id;
  await notificationService.markAsRead(userId, id as string);
  res.status(200).json({ message: "Notification marked as read" });
});

export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user! as any).id;
    await notificationService.markAllAsRead(userId);
    res.status(200).json({ message: "All notifications marked as read" });
  },
);

export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req.user! as any).id;
    await notificationService.deleteNotification(userId, id as string);
    res.status(200).json({ message: "Notification deleted" });
  },
);

export const deleteAllNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user! as any).id;
    await notificationService.deleteAllNotification(userId);
    res.status(200).json({ message: "All notifications deleted" });
  },
);
