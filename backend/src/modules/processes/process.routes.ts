import { Router } from "express";
import { requireAuth, requireRole } from "@/modules/auth/auth.middleware";
import {
  listProcesses,
  createProcess,
  updateProcess,
  startProcess,
  stopProcess,
  restartProcess,
  deleteProcess
} from "./process.controller";

const router = Router({ mergeParams: true });

router.get("/", requireAuth, listProcesses);
router.post("/", requireAuth, requireRole("ADMIN"), createProcess);
router.put("/:processId", requireAuth, requireRole("ADMIN"), updateProcess);
router.post("/:processId/start", requireAuth, requireRole("ADMIN"), startProcess);
router.post("/:processId/stop", requireAuth, requireRole("ADMIN"), stopProcess);
router.post("/:processId/restart", requireAuth, requireRole("ADMIN"), restartProcess);
router.delete("/:processId", requireAuth, requireRole("ADMIN"), deleteProcess);

export default router;
