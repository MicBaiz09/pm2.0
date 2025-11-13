import http from "http";
import path from "path";
import express from "express";
import app from "./app";
import env from "@/config/env";
import { logger } from "@/config/logger";
import { createSocketServer } from "@/websocket";

const server = http.createServer(app);
createSocketServer(server);

if (env.NODE_ENV === "production") {
  const clientPath = path.join(process.cwd(), "..", "frontend", "dist");
  app.use(express.static(clientPath));
  app.get("*", (_req, res) => res.sendFile(path.join(clientPath, "index.html")));
}

server.listen(env.PORT, () => {
  logger.info(`Server listening on :${env.PORT}`);
});
