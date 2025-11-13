import { Router } from "express";
import { prisma } from "@/config/prisma";
import { requireAuth, requireRole } from "@/modules/auth/auth.middleware";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN"), async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

export default router;
