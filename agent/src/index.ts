import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import { ProcessManager } from "../../backend/src/services/processManager";

config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const header = req.headers.authorization;
  if (!header || header !== `Bearer ${process.env.AGENT_TOKEN}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const manager = new ProcessManager();

app.get("/status", authMiddleware, (_req, res) => {
  res.json(manager.list());
});

app.post("/processes/:id/start", authMiddleware, async (req, res) => {
  const body = req.body;
  await manager.start({
    id: req.params.id,
    name: body.name,
    command: body.command,
    cwd: body.cwd,
    env: body.env ?? {},
    instances: body.instances ?? 1,
    autoRestart: body.autoRestart ?? true
  });
  res.status(202).json({ status: "started" });
});

app.post("/processes/:id/stop", authMiddleware, async (req, res) => {
  await manager.stop(req.params.id);
  res.status(202).json({ status: "stopped" });
});

app.post("/processes/:id/restart", authMiddleware, async (req, res) => {
  await manager.restart(req.params.id);
  res.status(202).json({ status: "restarted" });
});

app.delete("/processes/:id", authMiddleware, async (req, res) => {
  await manager.remove(req.params.id);
  res.status(204).send();
});

const port = Number(process.env.PORT ?? 7001);
app.listen(port, () => {
  console.log(`Agent listening on ${port}`);
});
