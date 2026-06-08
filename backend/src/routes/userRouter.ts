import { Router } from "express";
import { verifyUser } from "../middleware/verifyUserRoute";
import * as userController from "../controllers/user.controller";
import inventoryRouter from './inventoryRouter'
import reminderRouter from "./reminderRouter";
import notificationRouter from "./notificationRouter";
import { upload } from "../middleware/uploadImg"; 
import { userOnBoarding } from "../controllers/onboarding.controller";
import { getReports } from "../controllers/reports.controller";

const UserRouter = Router();
UserRouter.use(verifyUser)

UserRouter.put('/', userController.updateUser);
UserRouter.put('/password', userController.changePassword)
UserRouter.patch("/avatar",upload.single("avatar"), userController.updateAvatar);
UserRouter.use('/reminder', reminderRouter)
UserRouter.use('/inventory', inventoryRouter )
UserRouter.post('/onboarding', userOnBoarding)
UserRouter.use('/notification', notificationRouter)
UserRouter.get('/reports', getReports)
UserRouter.get('/', userController.getUser)

export default UserRouter