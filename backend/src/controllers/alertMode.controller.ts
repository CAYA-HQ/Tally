import type { Request, Response } from "express";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler";
import { getUserById } from "../service/user.service";
import { whatsappAlertVerification } from "../service/whatsapp.service";
import { User } from "../model/User";
import { getUserId } from "../utils/getUserId";

export const whatsAppReminder = asyncHandler(
  async (req: Request, res: Response) => {
    const { enable } = req.body;
    const userId = getUserId(req)
  
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message:
          "Add a valid phone number before enabling WhatsApp reminders",
      });
    }

    // Disable WhatsApp reminders
    if (!enable) {
      user.alertMode = user.alertMode.filter(
        (mode) => mode !== "whatsapp"
      );

      await user.save();

      return res.status(201).json({
        success: true,
        message: "WhatsApp reminders disabled",
        alertMode: user.alertMode,
        enable: user.alertMode.includes('whatsapp')
      });
    }

    // Already verified
    if (user.whatsappVerified) {
      if (!user.alertMode.includes("whatsapp")) {
        user.alertMode.push("whatsapp");
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: "WhatsApp reminder enabled",
        alertMode: user.alertMode,
        enable: user.alertMode.includes('whatsapp')
      });
    }

    // Not verified yet
    user.whatsappToken = crypto
      .randomBytes(16)
      .toString("hex");

    await user.save();

    await whatsappAlertVerification(
      user.email,
      user.whatsappToken
    );

    return res.status(200).json({
      success: true,
      message: "Check your email to verify WhatsApp reminders",
      enable: user.alertMode.includes('whatsapp')
    });
  }
);


export const getWhatsappNotif = asyncHandler(async(req: Request, res: Response)=>{
  const userId = getUserId(req)

  console.log(userId)

  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'update whatsapp reminder option',
    enable: user.alertMode.includes('whatsapp')
  })

})

export const pushReminder = asyncHandler(
  async (req: Request, res: Response) => {
    const { enable } = req.body;
    const userId = getUserId(req)

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (enable) {
      if (!user.alertMode.includes("push")) {
        user.alertMode.push("push");
      }
    } else {
      user.alertMode = user.alertMode.filter(
        (mode) => mode !== "push"
      );
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: enable
        ? "Push reminder enabled"
        : "Push reminder disabled",
      alertMode: user.alertMode,
      enable: user.alertMode.includes('push')
    });
  }
);