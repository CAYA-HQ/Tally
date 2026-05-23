import { useEffect } from "react";
import { socket } from "../utils/ioSocket";
import { useNotificationStore } from "../utils/zustand";

export const NotificationProvider = ({children}) => {

  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  useEffect(() => {

    socket.on("notification:new", (data) => {
      addNotification(data);
    });
    console.log(useNotificationStore.getState().notifications)

    return () => {
      socket.off("notification:new");
    };

  }, [addNotification]);

  return <>{children}</>;
}