import type { Request, Response, NextFunction } from "express";
import { Reminder } from "../model/Reminder";
import { asyncHandler } from "../utils/asyncHandler";
import { setNotification } from "../service/notification.service";

export const createReminder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, date, time, priority } = req.body;
    const userId = (req as any).user.id;

    const reminder = await Reminder.create({
      userId,
      title,
      description,
      date,
      time,
      priority,
    });

    await setNotification(
        userId,
        'Reminder set',
        'Reminder'
      )

    res.status(201).json({
      success: true,
      data: reminder,
    });
  },
);

export const getReminders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const reminders = await Reminder.find({ userId }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders,
    });
  },
);

export const getSingleReminder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const reminder = await Reminder.findOne({ _id: req.params.id, userId });

    if (!reminder) {
      const error = new Error("Reminder not found");
      (error as any).statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: reminder,
    });
  },
);

export const updateReminder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true, runValidators: true },
    );

    if (!reminder) {
      const error = new Error("Reminder not found");
      (error as any).statusCode = 404;
      return next(error);
    }

    await setNotification(
        userId,
        'Reminder updated',
        'Reminder'
      )

    res.status(200).json({
      success: true,
      data: reminder,
    });
  },
);

export const deleteReminder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!reminder) {
      const error = new Error("Reminder not found");
      (error as any).statusCode = 404;
      return next(error);
    }

    await setNotification(
        userId,
        'Reminder deleted',
        'Reminder'
      )

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
    });
  },
);
