import { Router } from "express";
import { validate } from "../utils/validate.middleware";
import { createUserSchema } from "../model/validate.user";
import * as userController from "../controllers/user.controller";

const UserRouter = Router();

UserRouter.get('/', userController.getUsers);
UserRouter.get('/:id', userController.getUserById);
UserRouter.post('/', validate(createUserSchema), userController.createUser);
UserRouter.put('/:id', userController.updateUser);
UserRouter.delete('/:id', userController.deleteUser);

export default UserRouter