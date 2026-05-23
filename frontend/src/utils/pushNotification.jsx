import { useEffect } from "react";
import { createSocket } from "../services/socket";

export const useAlerts = (userId) => {
  useEffect(() => {
    const socket = createSocket(userId);

    const init = async () => {
      if (!("Notification" in window)) return;

      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
    };

    init();

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
  }, [userId]);
};

// Import and use this hook in app.jsx
// useAlerts(userId);