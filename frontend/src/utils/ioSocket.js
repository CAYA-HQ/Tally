import { io } from "socket.io-client";
import { getAccessToken } from "./session/token";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  auth: {
    token: getAccessToken(),
  },

  withCredentials: true,
});


export const liveNotification = (notification, setNotifications) => {

    socket.on("notification:new", (notification) => {
        
        setNotifications((prev) => {

            const exists = prev.some(
              (item) => item._id === notification._id
            );
        
            if (exists) return prev;
        
            return [notification, ...prev];
        });
    });

    return () => {
      socket.off("notification:new");
    };
}