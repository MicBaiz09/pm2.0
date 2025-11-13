import { Router } from "express";
import authRoutes from "@/modules/auth/auth.routes";
import serverRoutes from "@/modules/servers/server.routes";
import userRoutes from "@/modules/users/user.routes";
import processRoutes from "@/modules/processes/process.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/servers", serverRoutes);
router.use("/servers/:serverId/processes", processRoutes);

export default router;
