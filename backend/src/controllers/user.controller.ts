import type { Request, Response, NextFunction } from "express";
import * as userService from "../service/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { payLoad } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import cloudinary from "../config/cloudinary";
import { setNotification } from '../service/notification.service'
import {uploadToCloudinary} from '../middleware/uploadImg'
import { getUserId } from "../utils/getUserId";


// UPDATE USER
export const updateUser = asyncHandler(
  async (req: Request, res: Response ) => {
    const {
    firstName,
    lastName,
    email,
    phoneNumber,
    countryCode
  } = req.body;
    const updateUserInfo = ({
      name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
      username: email,
      phone: phoneNumber  ||  '',
      countryCode
    } as any);
    
    const userId = getUserId(req)

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const allowedUpdates = [
      "name",
      "username",
      "phone",
      "countryCode",
    ];

    const updates: Record<string, any> = {};

    for (const key of allowedUpdates) {
      if (updateUserInfo[key] !== undefined) {
        updates[key] = updateUserInfo[key];
      }
    }

    const updatedUser = user.set(updates);

    await user.save();
    const sendUser = payLoad(user as any);

    await setNotification(
      user.id,
      (sendUser as any),
      "You updated you information successfully 🎉",
      "user",
    );
    console.log("user updated successfully 🎉:", updatedUser);

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
    const userId = getUserId(req)

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

    const result = await uploadToCloudinary(file.buffer, "avatars");

    user.avatar = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    await user.save();
    await setNotification(user.id, 'avatar updated successfully', 'user', user.name)

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

    const userId = getUserId(req)
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
      return res.status(404).json({
        success: false,
        message: 'incorrect password'
      })
    }

    user.password = newEncryptedPassword
    await user.save()
    
    await setNotification(user.id, 'password changed successfully ✅', 'user', user.name)

    
    res.status(200).json({
      success: true,
      message: 'password changed successfully'
    })
  }
)


//getting user's info
export const getUser = asyncHandler(async(req: Request, res: Response)=>{
  const userId = getUserId(req)

  const userInfo = await userService.getUserById(userId)
  if(!userInfo) return res.status(400).json({
    success: false,
    mesage: 'failed to get users info'
  })
  console.log(userInfo)

  const payload = payLoad(userInfo as any)

  res.status(200).json({
    success: true,
    message: 'user successfuly sent✅',
    payload
  })
})