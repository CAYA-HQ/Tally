import type { Request, Response, NextFunction } from "express";
import { createUserSchema } from "../model/validate.user";
import * as userService from "../service/user.service";
import { asyncHandler } from "../utils/asyncHandler";

// CREATE USER
export const createUser = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const validatedData = createUserSchema.parse(req.body);
    const user = await userService.createUser(validatedData);
    console.log("Created user:", user);
    res.status(201).json({
      success: true,
      data: user,
    });
  }
);

// GET ALL USERS
export const getUsers = asyncHandler(
  async (_req: Request, res: Response) => {
    const users = await userService.getUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  }
);

// GET USER BY ID
export const getUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserById(req.params.id as string);

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

// DELETE USER
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.deleteUser(req.params.id as string);

    if (!user) {
      const error = new Error("User not found");
      (error as any).statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
);
