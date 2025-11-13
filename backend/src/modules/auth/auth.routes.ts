import { Router } from "express";
import { loginHandler, registerHandler } from "./auth.controller";
import { requireAuth, requireRole } from "./auth.middleware";

const router = Router();

router.post("/login", loginHandler);
router.post("/register", requireAuth, requireRole("ADMIN"), registerHandler);

export default router;
