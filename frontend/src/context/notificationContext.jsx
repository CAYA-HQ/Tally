import { useEffect } from "react";
import { socket, connectSocket } from "../utils/ioSocket";
import { useNotificationStore, useAccessTokenStore } from "../utils/zustand";
import api from "../utils/api";

export const NotificationProvider = ({children}) => {

  const {notifications, setNotifications,
  addNotification, setSeenNotification} = useNotificationStore();

  const token = useNotificationStore(
    (state) => state.accessToken)

    // Fetch notifications on mount only if the user is authenticated
  useEffect(() => {
    if (!token) {
      return;
    }

    connectSocket(token);
    const prevNotificationLength = notifications.length

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
  }, [token, setNotifications]);

  // Listen for real-time notifications via socket
  useEffect(() => {

    socket.on("notification:new", (data) => {
      addNotification(data);
      setSeenNotification(false)
       console.log({
      'notification seen': seenNotification,
      'notification length is there': notifications.length > 0
    })

    });

    return () => {
      socket.off("notification:new");
    };
  }, [addNotification]);

  return <>{children}</>;
};
