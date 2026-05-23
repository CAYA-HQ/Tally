import { Router } from "express";
import { verifyUser } from "../middleware/verifyUserRoute";
import * as userController from "../controllers/user.controller";
import inventoryRouter from './inventoryRouter'
import reminderRouter from "./reminderRouter";
import notificationRouter from "./notificationRouter";
import { upload } from "../middleware/uploadImg"; 
import { userOnBoarding } from "../controllers/onboarding.controller";
import { getNotification } from "../controllers/notification.controller";
import { SendEmailAlert, editAlert, deleteAlert } from "../controllers/emailAlert.controller";

const UserRouter = Router();
UserRouter.use(verifyUser)

UserRouter.put('/', userController.updateUser);
UserRouter.put('/password', userController.changePassword)
UserRouter.patch("/avatar",upload.single("avatar"), userController.updateAvatar);
UserRouter.post('/alert', SendEmailAlert)
UserRouter.put('/alert/:id', editAlert)
UserRouter.delete('/alert/:id', deleteAlert)
UserRouter.use('/reminder', reminderRouter)
UserRouter.use('/inventory', inventoryRouter )
UserRouter.use('/notification', notificationRouter)
UserRouter.post('/onboarding', userOnBoarding)
UserRouter.get('/notification', getNotification)

export default UserRouter