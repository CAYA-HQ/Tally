import { useEffect } from "react";
import { useAccessTokenStore } from "../utils/zustand";
import { connectSocket, socket } from "./ioSocket";
import { toast } from "react-toastify";

export const usePushReminders = (enable) => {
  const accessToken = useAccessTokenStore((state)=>state.accessToken)

  useEffect(() => {
    if(!accessToken){
      toast.error("can't set up push notification, access token missing")
      return
    }
    connectSocket(accessToken);

    const initPush = async () => {
      if (!("Notification" in window)) return;

      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
    };

    initPush();

    socket.on("alert", (data) => {
      if (Notification.permission === "granted") {
        new Notification(data.title, {
          body: data.message,
          icon: "/logo.png",
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ enable, accessToken ]);
};
