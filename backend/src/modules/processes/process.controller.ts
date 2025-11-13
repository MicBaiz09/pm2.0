import { Request, Response, NextFunction } from "express";
import { ProcessService } from "./process.service";
import { ProcessCreateSchema, ProcessUpdateSchema } from "./process.types";

const service = new ProcessService();

export const listProcesses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.listByServer(req.params.serverId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createProcess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = ProcessCreateSchema.parse({ ...req.body, serverId: req.params.serverId });
    const bot = await service.create(payload);
    res.status(201).json(bot);
  } catch (err) {
    next(err);
  }
};

export const updateProcess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = ProcessUpdateSchema.parse(req.body);
    const bot = await service.update(req.params.processId, payload);
    res.json(bot);
  } catch (err) {
    next(err);
  }
};

export const startProcess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.start(req.params.processId);
    res.status(202).json({ status: "starting" });
  } catch (err) {
    next(err);
  }
};

export const stopProcess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.stop(req.params.processId);
    res.status(202).json({ status: "stopping" });
  } catch (err) {
    next(err);
  }
};

export const restartProcess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.restart(req.params.processId);
    res.status(202).json({ status: "restarting" });
  } catch (err) {
    next(err);
  }
};

export const deleteProcess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await service.delete(req.params.processId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
