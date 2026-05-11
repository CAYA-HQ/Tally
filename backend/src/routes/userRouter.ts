import { Router } from "express";
import { verifyUser } from "../middleware/verifyUserRoute";
import * as userController from "../controllers/user.controller";
import inventoryRouter from './inventoryRouter'
import reminderRouter from "./reminderRouter";

const UserRouter = Router();
UserRouter.use(verifyUser)

UserRouter.put('/:id', userController.updateUser);
UserRouter.post('/alert')
UserRouter.use('/reminder', reminderRouter)
UserRouter.use('/inventory', inventoryRouter )

export default UserRouter