import { Router } from "express";
import { verifyUser } from "../middleware/verifyUserRoute";
import * as userController from "../controllers/user.controller";
import inventoryRouter from './inventoryRouter'
import reminderRouter from "./reminderRouter";
import { upload } from "../middleware/uploadImg"; 
import { userOnBoarding } from "../controllers/onboarding.controller";

const UserRouter = Router();
UserRouter.use(verifyUser)

UserRouter.put('/', userController.updateUser);
UserRouter.put('/password', userController.changePassword)
UserRouter.patch("/avatar",upload.single("avatar"),userController.updateAvatar);
// UserRouter.post('/alert')
UserRouter.use('/reminder', reminderRouter)
UserRouter.use('/inventory', inventoryRouter )
UserRouter.post('/onboarding', userOnBoarding)

export default UserRouter