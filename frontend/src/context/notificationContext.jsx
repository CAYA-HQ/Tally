import { useEffect } from "react";
import { socket, connectSocket } from "../utils/ioSocket";
import { useNotificationStore, useAccessTokenStore } from "../utils/zustand";
import api from "../utils/api";

export const NotificationProvider = ({children}) => {

  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );
  const token = useNotificationStore(
    (state) => state.accessToken)

  // Fetch notifications on mount only if the user is authenticated
  useEffect(() => {
    
    if (!token) {
      return;
    }

    connectSocket(token);

    const fetchNotifications = async () => {
      try {
        const response = await api.get("/user/notification");
        const notifications = response.data.notification || [];
        setNotifications(notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, [setNotifications]);

  // Listen for real-time notifications via socket
  useEffect(() => {
    socket.on("notification:new", (data) => {
      addNotification(data);
    });

    return () => {
      socket.off("notification:new");
    };
  }, [addNotification]);

  return <>{children}</>;
}