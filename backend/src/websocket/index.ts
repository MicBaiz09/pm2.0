import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import env from "@/config/env";
import { bootstrapLogStream } from "@/services/logStream";

export const createSocketServer = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: env.SOCKET_ORIGIN ? { origin: env.SOCKET_ORIGIN.split(',').map((o) => o.trim()) } : undefined
  });

  bootstrapLogStream(io);
  return io;
};
