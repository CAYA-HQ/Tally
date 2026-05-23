import type { Request, Response, RequestHandler } from "express";
import { Alert } from "../model/alert.model";
import { createAlert, removeAlertJob } from "../service/alertWorker.service";
import { asyncHandler } from "../utils/asyncHandler";
import { setNotification } from "../service/notification.service";

// create alert
export const SendEmailAlert: RequestHandler = asyncHandler(async(req: Request, res: Response)=>{
  const{
    title,
    reminder,
    alertAt,
    timezone,
    repeatType,
    repeatDays,
    alertMode,
  } = req.body

  const userId = (req.user as any).id

  const alertData = {
    title,
    reminder,
    alertAt,
    timezone,
    repeatType,
    repeatDays,
    userId,
    alertMode
  }

  //Send alert info to worker to create job
  const alert = await createAlert(alertData)
  
  res.status(201).json({
    success: true,
    message: "Alert created successfully",
    data: {
      alert
    }
  })

})

// Delete alert
export const deleteAlert = asyncHandler(async (req: Request, res: Response) => {

  const alertId = req.params.id;

  if (!alertId) {
    return res.status(400).json({
      success: false,
      message: "Alert id is required",
    });
  }

  const userId = (req.user as any).id;

  const alert = await Alert.findOne({ _id: alertId, user: userId });

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found",
    });
  }

  if (!alert.jobId) {
    return res.status(400).json({
      success: false,
      message: "Invalid job reference",
    });
  }

  const jobId = alert.jobId;

  await removeAlertJob(alert, jobId, userId);
  await alert.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Alert deleted successfully",
  });
});


// Edit alert
export const editAlert = asyncHandler(async (req: Request, res: Response) => {

  const alertId = req.params.id;

  if (!alertId) {
    return res.status(400).json({
      success: false,
      message: "Alert id is required",
    });
  }

  const userId = (req.user as any).id;

  const alert = await Alert.findOne({ _id: alertId, user: userId });

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: "Alert not found",
    });
  }

  const updates = req.body;

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
      reminder: updatedAlert.reminder,
      alertAt: updatedAlert.alertAt,
    },
    `Alert "${updatedAlert.title}" has been updated successfully!`,
    "alert"
  )

  const newAlert = await createAlert({
    title: updatedAlert.title,
    reminder: updatedAlert.reminder,
    alertAt: updates.alertAt,
    timezone: updatedAlert.timezone,
    repeatType: updatedAlert.repeatType,
    repeatDays: updatedAlert.repeatDays,
    userId: userId,
  })

  return res.status(200).json({
    success: true,
    message: "Alert updated successfully",
    data: {
      alert: newAlert
    }
  });

})
