import type { Request, Response, NextFunction } from "express";
import * as userService from "../service/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { payLoad } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import cloudinary from "../config/cloudinary";


// UPDATE USER
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const updateUserInfo = req.body;
    
    const userId = (req.user as any)?.id;

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    if (!user.metadata.notification) {
      user.metadata.notification = [];
    }

    const allowedUpdates = [
      "name",
      "username",
      "phone",
    ];

    const updates: Record<string, any> = {};

    for (const key of allowedUpdates) {
      if (updateUserInfo[key] !== undefined) {
        updates[key] = updateUserInfo[key];
      }
    }

    user.set(updates);

    await user.save();

    userService.setNotification(
      user,
      "updated successfully 🎉",
      "user"
    );

    const sendUser = payLoad(user as any);

    return res.status(200).json({
      success: true,
      message: "updated successfully 🎉",
      sendUser,
    });
  }
);

// update avatar
export const updateAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req.user as any).id;

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const file = req.file as any;

    user.avatar = {
      url: file.path,
      public_id: file.filename,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully 🎉",
      avatar: user.avatar,
    });
  }
);


// change password
export const changePassword = asyncHandler(
  async(req: Request, res: Response, next: NextFunction)=>{

    const userId = (req.user as any)?.id
    const { newPassword, oldPassword } = req.body
    const user = await userService.getUserById(userId)

    if(!user){
      return res.status(404).json({
        success: false,
        message: 'user not found'
      })
    }

    if(!oldPassword || !newPassword){
      return res.status(400).json({
        success: false,
        message: 'input old and new password to proceed'
      })
    }

    const newEncryptedPassword = await hashPassword(newPassword)
    const oldEncryptedPassword = await hashPassword(oldPassword)

    const verifyPassword = comparePassword(oldEncryptedPassword, user?.password as string)

    if(!verifyPassword){
      return res.status(401).json({
        success: false,
        message: 'incorrect password'
      })
    }

    user.password = newEncryptedPassword
    userService.setNotification(user, 'password changed successfully ✅', 'user')

    await user.save()
    res.status(200).json({
      success: true,
      message: 'password changed successfully'
    })
  }
)