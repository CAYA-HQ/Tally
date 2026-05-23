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
