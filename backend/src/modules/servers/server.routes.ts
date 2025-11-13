import { Router } from "express";
import { requireAuth, requireRole } from "@/modules/auth/auth.middleware";
import { ServerSchema } from "./server.types";
import { ServerService } from "./server.service";

const router = Router();
const service = new ServerService();

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    res.json(await service.list());
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const data = ServerSchema.parse(req.body);
    const server = await service.create(data);
    res.status(201).json(server);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const data = ServerSchema.partial().parse(req.body);
    const server = await service.update(req.params.id, data);
    res.json(server);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
