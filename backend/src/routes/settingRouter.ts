import { Router } from "express";
import {
  getNotifications,
  updateNotifications,
  deleteSessions,
  get2FA,
  set2FA,
  // updateSecurity,
  // updateBillings,
} from "../controllers/settings.controller";

const settings = Router();

settings.get("/notifications", getNotifications);
settings.put("/notifications", updateNotifications);
// settings.put("/security", updateSecurity);
// settings.put("/billing", updateBillings);
settings.delete("/sessions", deleteSessions);
settings.put("/2fa", set2FA);
settings.get("/2fa", get2FA);

export default settings;
