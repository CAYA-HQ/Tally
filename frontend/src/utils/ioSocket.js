import { io } from "socket.io-client";
import { getAccessToken } from "./session/token";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

socket.auth = {
  token: getAccessToken(),
}

socket.connect()

export const liveNotification = (setNotifications) => {

  const handleNotification = (notification) => {

    setNotifications((prev) => {

      const exists = prev.some(
        (item) => item._id === notification._id
      );

      if (exists) return prev;

      return [notification, ...prev];
    });
  };

  socket.on(
    "notification:new",
    handleNotification
  );

  return () => {
    socket.off(
      "notification:new",
      handleNotification
    );
  };
};