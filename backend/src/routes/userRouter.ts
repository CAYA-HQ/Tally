import { Router } from "express";
import * as userController from "../controllers/user.controller";

const UserRouter = Router();

UserRouter.get('/', userController.getUsers);
UserRouter.get('/:id', userController.getUserById);
UserRouter.post('/', userController.createUser);
UserRouter.put('/:id', userController.updateUser);
UserRouter.delete('/:id', userController.deleteUser);

export default UserRouter