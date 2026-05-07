import { Router } from "express";
import { verifyUser } from "../middleware/verifyUserRoute";
import * as userController from "../controllers/user.controller";

const UserRouter = Router();
UserRouter.use(verifyUser);

UserRouter.get('/', userController.getUsers);
UserRouter.get('/:id', userController.getUserById);
UserRouter.put('/:id', userController.updateUser);
UserRouter.delete('/:id', userController.deleteUser);

export default UserRouter