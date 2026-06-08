import { useAccessTokenStore, usePushStore, useWhatsappStore } from "./zustand";
import { connectSocket, socket } from "./ioSocket";
import { toast } from "react-toastify";
import api from './api'

export const setupPushReminders = async (enable, accessToken) => {
  // if (!enable) {
  //   socket.off("alert:sent");
  //   toast.info("Push reminders disabled");
  //   return;
  // }

  if (!socket.connected) {
    connectSocket(accessToken);
  }

  if (!("Notification" in window)) return;

  const permission =
    Notification.permission === "default"
      ? await Notification.requestPermission()
      : Notification.permission;

  if (permission !== "granted") {
    toast.error(
      "Push reminders denied. Enable notifications in browser settings."
    );
    return;
  }

  try{
    const res = await api.post("/user/reminder/push", {
      enable,
    });

    enable ?
    toast.success(res.data.message) :
    toast.info(res.data.message)

    usePushStore.getState().setPushNotif(res.data.enable)
    
  }catch(err){
    toast.error(`Error setting up push reminders: ${err}`);
    return;
  }

  socket.on("alert:sent", (data) => {
    new Notification(data.title, {
      body: data.note,
      icon: "/logo.png",
    });
  });

};


export const setupWhatsappReminders = async (enable) => {

  try {
    const res = await api.post("/user/reminder/whatsApp", {
      enable,
    });
    
    if (res.status === 201){
      toast.info(res.data.message)
    }else if(res.status === 200){
      toast.success(res.data.message)
    }else{
      toast.error(res.data.message)
    }
    useWhatsappStore.getState().setWhatsappNotif(res.data.enable)

  } catch (err) {
    err.status === 400
      ? toast.error("Update your profile with a valid phone number")
      : toast.error(`Error updating WhatsApp reminders: ${err}`);
    useWhatsappStore.getState().setWhatsappNotif(false)
  }
};


export const getWhatsappNotif = async()=>{
  try{
    const res = await api.get('/user/reminder/whatsapp')
    const enable = res.data.enable

    useWhatsappStore.getState().setWhatsappNotif(enable)
  }catch(err){}
}