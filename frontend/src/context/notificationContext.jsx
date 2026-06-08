import { useEffect } from "react";
import { socket, connectSocket, disconnectSocket } from "../utils/ioSocket";
import { useNotificationStore, useAccessTokenStore } from "../utils/zustand";
import { Outlet, useLocation } from "react-router-dom";
import api from "../utils/api";

export const NotificationProvider = () => {

  const {notifications, setNotifications, addNotification,
    setNextCursor, nextCursor
  } = 
  useNotificationStore();

  const token = useAccessTokenStore((state) => state.accessToken)

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }
    connectSocket(token);
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/user/notification");
        setNotifications(response.data.notifications || [])
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();

  }, [token]);

  // Listen for real-time notifications via socket
  useEffect(() => {
    const handleNotification = (data) => {
      addNotification(data);
    };

    socket.on("notification:new", handleNotification);

    return () => {
      socket.off("notification:new", handleNotification);
    };
  }, [addNotification]);

  return <Outlet />;
};
