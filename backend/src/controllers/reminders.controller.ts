import type { Request, Response, RequestHandler } from "express";
import { Alert } from "../model/Reminders.model";
import { createAlert, removeAlertJob, scheduleAlertJob } from "../service/alertWorker.service";
import { asyncHandler } from "../utils/asyncHandler";
import { setNotification } from "../service/notification.service";
import { getUserById } from "../service/user.service";
import { AlertAt } from "../utils/date";


// create alert
export const createReminder = asyncHandler(async(req: Request, res: Response)=>{
  const{
    title, note, date, time, mode,
    frequency, weekday, monthDay, repeatType = "none",
    repeatDays, alertMode,
  } = req.body

  const userId = (req.user as any).id
  const user = await getUserById(userId)
  if(!user){
    return res.status(404).json({
      success: false,
      message: 'user not found'
    })
  }
  const timezone = await user.metadata?.timezone;

  const startdate = new Date();
  startdate.setDate(startdate.getDate() + 1);
  startdate.setHours(0, 0, 0, 0);

  const alertAt = AlertAt(date, time, timezone) as string
  console.log('alertAt saved:', alertAt)

  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  console.log(hours, minutes, seconds);
  
  console.log({
    date,
    time,
    alertAt,
    parsed: new Date(alertAt),
    timezone,
    });
    
  if (!alertAt || isNaN(new Date(alertAt).getTime())) {
    throw new Error("Invalid alertAt date");
  }

  const alertData = {
    title, note, alertAt, timezone, userId, email: user.email,
    alertMode, date, time, mode, frequency, weekday,
    monthDay, repeatType, repeatDays, startDate: new Date(startdate),
  }
  
  const alert = await Alert.create({
    ...alertData,
    email: user.email,
    whatsappNumber: user.phone,
  } as any);
  
  if (!alert) {
    return res.status(500).json({
      success: false,
      message: "Failed to create alert",
    });
  }

  const alertId = alert._id.toString();
  
  // Set notification for the user
  await setNotification(
    userId,
    { alertId, title, note, alertAt},
    `Alert "${title}" has been set for ${new Date(alertAt).toLocaleString()}`,
    "alert"
  )

  //Send alert info to worker to create job
  const jobId = await createAlert({...alertData, alertId: alertId})
  if (!jobId) return res.status(500).json({
    message: "Failed to create alert",
    success: false,
  })
  alert.jobId = jobId as string;

  await alert.save().catch((err)=>{
    console.error("Failed to save alert with jobId:", err);
  });
  console.log("Alert created with jobId:", alert.jobId);

  res.status(201).json({
    success: true,
    message: "Alert created successfully",
    alert,
    id: alertId,
  })

})


// Delete alert
export const deleteReminder = asyncHandler(async (req: Request, res: Response) => {

  const alertId = req.params.id;

  if (!alertId) {
    return res.status(400).json({
      success: false,
      message: "Alert id is required",
    });
  }

  const userId = (req.user as any).id;

  const alert = await Alert.findOne({ _id: alertId, userId });

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found",
    });
  }

  if (!alert.jobId) {
    return res.status(405).json({
      success: false,
      message: "Invalid job reference",
    });
  }

  const jobId = alert.jobId;

  if (jobId) {
    try {
      await removeAlertJob(alert, alert.jobId, userId);
    } catch (err) {
      console.warn("Job removal failed, continuing delete", err);
    }
  }

  await alert.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Alert deleted successfully",
  });
});


// Edit alert
export const updateReminder = asyncHandler(async (req: Request, res: Response) => {

  const alertId = req.params.id;

  if (!alertId) {
    return res.status(400).json({
      success: false,
      message: "Alert id is required",
    });
  }

  const userId = (req.user as any).id;
  const user = await getUserById(userId)
  if(!user){
    return res.status(404).json({
      success: false,
      message: 'user not found'
    })
  }

  const timezone = await user.metadata?.timezone || 'UTC';
  const alert = await Alert.findOne({ _id: alertId, userId });

  if (!alert) {
    return res.status(405).json({
      success: false,
      message: "Alert not found",
    });
  }

  const {
    title, note, date, time, mode, frequency, weekday, monthDay,
    timezone: requestTimezone, repeatType, repeatDays, alertMode,
  } = req.body;

  const updates: any = {
    title, note, date, time, mode, frequency, weekday, monthDay,
    timezone: requestTimezone || timezone, repeatType, repeatDays,
    alertMode, email: alert.email,
  };

  const alertAt = AlertAt(date, time, timezone) as string
  updates.alertAt = alertAt

  const jobId = alert.jobId as string;
  await removeAlertJob(alert, jobId, userId);

  const updatedAlert = await Alert.findByIdAndUpdate(alertId, updates, { new: true });

  
  if (!updatedAlert) {
    return res.status(500).json({
      success: false,
      message: "Failed to update alert",
    });
   }

  await setNotification(
    userId,
    {
      alertId,
      title: updatedAlert.title,
      reminder: updatedAlert.note,
      alertAt: updatedAlert.alertAt,
    },
    `Alert "${updatedAlert.title}" has been updated successfully!`,
    "alert"
  );

  const rescheduledAlert = await scheduleAlertJob(updatedAlert);
    if (!rescheduledAlert) {
    return res.status(500).json({
      success: false,
      message: "Failed to reschedule alert",
    });
   }

  return res.status(200).json({
    success: true,
    message: "Alert updated successfully",
      alert: updatedAlert,
  });

})


// Get all alerts for a user
export const getReminders = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  if(!userId) return res.status(400).json({
    success: false,
    message: "User id is required",
  })
  console.log("Fetching alerts for user:", userId);
  const alerts = await Alert.find({ userId: userId }).sort({ alertAt: 1 });
  console.log("Retrieved alerts for user:", alerts.length);
  
  res.status(200).json({
    success: true,
    message: "Alerts retrieved successfully",
    alerts,
   
  });
})
