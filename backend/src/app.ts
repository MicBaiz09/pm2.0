import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "@/config/env";
import routes from "@/routes";
import { errorHandler } from "@/middleware/errorHandler";

const app = express();

app.use(cors({ origin: env.SOCKET_ORIGIN?.split(',').map((o) => o.trim()) ?? '*' }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);
app.get("/healthz", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

export default app;
