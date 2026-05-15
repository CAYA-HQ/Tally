import http from "http";
import { Server } from "socket.io";
import { env } from '../model/validate.user'


export const ioServer = (app: any)=>{
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  });
  server.listen(env.SOCKET_PORT, () => {
    console.log(`Server running on port ${env.SOCKET_PORT}`);
  });
  return io
}