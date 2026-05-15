import http from "http";
import { Server } from "socket.io";
import { env } from "../model/validate.user";
import { socketAuth } from "../middleware/socketio.middleware";

export let io: Server;

export const ioServer = (app: any) => {

  const server = http.createServer(app);

  io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {

    const userId = socket.data.userId;

    socket.join(userId);

    console.log(`User connected: ${userId}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return server;
};