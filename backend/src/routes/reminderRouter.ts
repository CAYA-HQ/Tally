import { Router } from "express";
import * as reminderController from "../controllers/reminders.controller";

const reminderRouter = Router();

reminderRouter.post("/", reminderController.createReminder);
reminderRouter.put("/:id", reminderController.updateReminder);
reminderRouter.delete("/:id", reminderController.deleteReminder);
reminderRouter.get("/", reminderController.getReminders);

export default reminderRouter;
