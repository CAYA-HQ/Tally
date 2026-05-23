import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../model/validate.user";


export const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {

  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(
      token,
      env.JWT_SECRET!
    ) as {
      id: string;
    };

    socket.data.userId = decoded.id;

    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
};