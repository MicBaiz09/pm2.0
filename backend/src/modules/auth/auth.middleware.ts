import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt";
import { UnauthorizedError, ForbiddenError } from "@/utils/errors";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: "ADMIN" | "VIEWER";
    }
    interface Request {
      user?: User;
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(UnauthorizedError());
  try {
    const token = header.split(" ")[1];
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch {
    return next(UnauthorizedError());
  }
};

export const requireRole = (role: "ADMIN" | "VIEWER") => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(UnauthorizedError());
    if (role !== req.user.role && req.user.role !== "ADMIN") {
      return next(ForbiddenError());
    }
    return next();
  };
};
