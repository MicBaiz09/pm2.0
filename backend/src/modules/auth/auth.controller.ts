import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { LoginSchema, RegisterSchema } from "./auth.types";

const service = new AuthService();

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = LoginSchema.parse(req.body);
    const result = await service.login(body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const registerHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = RegisterSchema.parse(req.body);
    const result = await service.register(req.user!.id, body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
