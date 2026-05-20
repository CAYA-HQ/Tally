import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as settingsService from "../service/settings.service";
import * as userService from "../service/user.service";
import { redis } from "../config/redis";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const profile = await settingsService.getProfile(userId);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Profile not found",
    });
  }

  return res.status(200).json({
    success: true,
    profile,
  });
});

export const getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)?.id;
    const notifications = await settingsService.getNotifications(userId);

    if (!notifications) {
      return res.status(404).json({
        success: false,
        message: "Notifications not found",
      });
    }

    return res.status(200).json({
      success: true,
      notifications,
    });
  },
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any)?.id;
    const updateData = req.body; // { email, name, phone, }

    const user = await settingsService.updateProfile(userId, updateData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  },
);

export const updateNotifications = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const updateData = req.body; // { email_notifications: { news_and_updates: true, tips_and_tutorials: true, reminders: true }, push_notifications: { comments: true, reminders: true } }

  const updatedUser = await settingsService.updateNotifications(
    userId,
    updateData,
  );

  if (!updatedUser) {
    return res.status(400).json({
      success: false,
      message: "Failed to update notifications",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Notifications updated successfully",
    notification: updatedUser.metadata.notifications,
  });
};

// export const updateSecurity = async (req: Request, res: Response) => {
//   const userId = (req.user as any)?.id;
//   const updateData = req.body; // {  }

//   await settingsService.updateSecurity(userId, updateData);

//   return res.status(200).json({
//     success: true,
//     message: "Security updated successfully",
//   });
// };

// export const updateBillings = async (req: Request, res: Response) => {
//   const userId = (req.user as any)?.id;
//   const updateData = req.body; // {  }

//   await settingsService.updateBilling(userId, updateData);

//   return res.status(200).json({
//     success: true,
//     message: "Billings updated successfully",
//   });
// };

export const deleteSessions = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;

  await userService.addToMetaData(userId, null, "sessions");

  await redis.del(`refresh:${userId}`);

  return res.status(200).json({
    success: true,
    message: "Sessions deleted successfully",
  });
};

export const get2FA = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;

  const allow2fa = await settingsService.get2FA(userId);
  if (allow2fa === null) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    allow2fa,
  });
};

export const set2FA = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const updateData = req.body; // { allow2fa: boolean }

  const updatedUser = await settingsService.set2FA(userId, updateData.allow2fa);
  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "2FA updated successfully",
    allow2fa: updatedUser.metadata.allow2fa,
  });
};
