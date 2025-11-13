import { Server as SocketIOServer } from "socket.io";
import { processManager } from "./processManager";

export const bootstrapLogStream = (io: SocketIOServer) => {
  processManager.on("log", (payload) => {
    io.to(`process:${payload.id}`).emit("log", payload);
  });

  processManager.on("status", (payload) => {
    io.emit("status", payload);
  });

  io.on("connection", (socket) => {
    socket.on("subscribe:process", (processId: string) => {
      socket.join(`process:${processId}`);
    });
    socket.on("unsubscribe:process", (processId: string) => {
      socket.leave(`process:${processId}`);
    });
  });
};
