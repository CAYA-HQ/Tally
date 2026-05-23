import { Router } from "express";
import {
  addInventory,
  deleteItem,
  updateInventory,
} from "../controllers/inventory.controller";

import {
  deleteNotification,
  deleteAllNotification,
  markAllAsRead,
  markAsRead,
} from "../controllers/notification.controller";

const notificationsRouter = Router();

notificationsRouter.delete("/:id", deleteNotification);
notificationsRouter.delete("/", deleteAllNotification);
notificationsRouter.put("/:id", markAsRead);
notificationsRouter.put("/", markAllAsRead);

export default notificationsRouter;
