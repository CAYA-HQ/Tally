import { Router } from "express";
import * as reminderController from "../controllers/reminders.controller";
import { whatsAppReminder, pushReminder, getWhatsappNotif } from "../controllers/alertMode.controller";

const reminderRouter = Router();

reminderRouter.post("/", reminderController.createReminder);
reminderRouter.put("/:id", reminderController.updateReminder);
reminderRouter.delete("/:id", reminderController.deleteReminder);
reminderRouter.get("/", reminderController.getReminders);
reminderRouter.post('/push', pushReminder)
reminderRouter.post('/whatsApp', whatsAppReminder);
reminderRouter.get('/whatsapp', getWhatsappNotif)

export default reminderRouter;
