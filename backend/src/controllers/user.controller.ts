import type { Request, Response, NextFunction } from "express";
import { createUserSchema } from "../model/validate.user";
import * as userService from "../service/user.service";
import { asyncHandler } from "../utils/asyncHandler";

// UPDATE USER
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = createUserSchema.partial().parse(req.body);

    const user = await userService.updateUser(
      req.params.id as string,
      validatedData
    );

    if (!user) {
      const error = new Error("User not found");
      (error as any).statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);