import type { Request, Response, RequestHandler } from "express";
import { Alert } from "../model/Reminders.model";
import { createAlert, removeAlertJob, reScheduleAlertJob } from "../service/alertWorker.service";
import { asyncHandler } from "../utils/asyncHandler";
import { setNotification } from "../service/notification.service";
import { getUserById } from "../service/user.service";
import { AlertAt } from "../utils/date";
import { getUserId } from "../utils/getUserId";


// create alert
export const createReminder = asyncHandler(async(req: Request, res: Response)=>{
  const{
    title, note, date, time, mode,
    frequency, weekday, monthDay, alertMode,
  } = req.body

  const userId = getUserId(req)
  const user = await getUserById(userId)

  if(!user){
    return res.status(404).json({
      success: false,
      message: 'user not found'
    })
  }

  const timezone = user.metadata?.timezone;

  const alertAt = AlertAt(date, time, timezone) as string
    
  if (!alertAt || isNaN(new Date(alertAt).getTime())) {
    throw new Error("Invalid alertAt date");
  }

  const alertData = {
    title, note, alertAt, timezone, userId, email: user.email,
    alertMode, date, time, mode, frequency, weekday, monthDay,
  }
  
  const alert = await Alert.create({
    ...alertData,
    email: user.email,
    whatsappNumber: user.phone,
  } as any);
  
  if (!alert) {
    return res.status(400).json({
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
  if (!jobId) {
    await alert.deleteOne()
    return res.status(400).json({
    message: "Failed to create alert",
    success: false,
  })}
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
  const userId = getUserId(req)
  const alertId = req.params.id;

  if (!alertId) {
    return res.status(400).json({
      success: false,
      message: "Alert id is required",
    });
  }

  const alert = await Alert.findOne({ _id: alertId, userId });

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found",
    });
  }

  const jobId = alert?.jobId as string;
  
  if (jobId) {
    try {
      await removeAlertJob(alert, jobId, userId);
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
  const userId = getUserId(req)
  const alertId = req.params.id;

  if (!alertId) {
    return res.status(400).json({
      success: false,
      message: "Alert id is required",
    });
  }

  const user = await getUserById(userId)

  if(!user){
    return res.status(404).json({
      success: false,
      message: 'user not found'
    })
  }

  const timezone = user.metadata?.timezone || 'UTC';
  const alert = await Alert.findOne({ _id: alertId, userId });

  if (!alert) {
    return res.status(402).json({
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

  const oldJobId = alert.jobId as string;

  const updatedAlert = await Alert.findByIdAndUpdate(alertId, updates, { new: true });

  if (!updatedAlert) {
    return res.status(403).json({
      success: false,
      message: "Failed to update alert",
    });
   }

  const rescheduledAlert = await reScheduleAlertJob(updatedAlert);
    if (!rescheduledAlert) {
    return res.status(405).json({
      success: false,
      message: "Failed to reschedule alert",
    });
   }

   if(oldJobId) await removeAlertJob(alert, oldJobId, userId);

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

  return res.status(200).json({
    success: true,
    message: "Alert updated successfully",
      alert: updatedAlert,
  });

})


// Get all alerts for a user
export const getReminders = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req)
  console.log("Fetching alerts for user:", userId);
  const alerts = await Alert.find({ userId: userId }).sort({ alertAt: 1 });
  console.log("Retrieved alerts for user:", alerts.length);
  
  res.status(200).json({
    success: true,
    message: "Alerts retrieved successfully",
    alerts,
   
  });
})
