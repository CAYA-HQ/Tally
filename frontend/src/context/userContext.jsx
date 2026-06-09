import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAccessTokenStore, useNotificationStore, usePushStore }
from "../utils/zustand";
import { getUser } from "../utils/fetchBackend";
import { connectSocket, socket } from "../utils/ioSocket";


export const UserProvider = () => {
  const token = useAccessTokenStore(
    (state) => state.accessToken
  );

  useEffect(() => {
  if (!token) return;

  connectSocket(token);

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log("Socket error:", err.message);
  });

  socket.on("alert:sent", (data) => {
  const pushEnabled =
    usePushStore.getState().pushNotif;

  if (!pushEnabled) return;

  new Notification(data.title, {
    body: data.note,
  });
});

  return () => {
    socket.off("connect");
    socket.off("connect_error");
  };
}, [token]);

  useEffect(() => {
    if (!token) return;

    getUser();
  }, [token]);

  return <Outlet />;
};