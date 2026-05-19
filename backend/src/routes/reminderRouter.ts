import { Router } from "express";
import * as reminderController from "../controllers/reminder.controller";

const reminderRouter = Router();

reminderRouter.post("/", reminderController.createReminder);
reminderRouter.get("/", reminderController.getReminders);
reminderRouter.get("/:id", reminderController.getSingleReminder);
reminderRouter.put("/:id", reminderController.updateReminder);
reminderRouter.delete("/:id", reminderController.deleteReminder);

export default reminderRouter;
