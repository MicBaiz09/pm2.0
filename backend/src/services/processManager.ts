import { ChildProcess, spawn } from "child_process";
import { EventEmitter } from "events";
import { logger } from "@/config/logger";

export interface ProcessConfig {
  id: string;
  name: string;
  command: string;
  cwd: string;
  env: Record<string, string>;
  instances: number;
  autoRestart: boolean;
}

export interface ProcessInfo {
  pid: number;
  status: "ONLINE" | "STOPPED" | "ERRORED" | "RESTARTING";
  startedAt?: Date;
  restarts: number;
}

interface ManagedProcess {
  config: ProcessConfig;
  processes: ChildProcess[];
  info: ProcessInfo[];
}

export class ProcessManager extends EventEmitter {
  private registry = new Map<string, ManagedProcess>();

  constructor() {
    super();
  }

  get(id: string) {
    return this.registry.get(id);
  }

  list() {
    return Array.from(this.registry.entries()).map(([id, data]) => ({
      id,
      config: data.config,
      info: data.info
    }));
  }

  async start(config: ProcessConfig) {
    const existing = this.registry.get(config.id);
    if (existing) {
      return this.restart(config.id);
    }

    const managed: ManagedProcess = { config, processes: [], info: [] };
    this.registry.set(config.id, managed);
    this.spawnInstances(config.id, managed);
  }

  async stop(id: string) {
    const managed = this.registry.get(id);
    if (!managed) return;

    managed.processes.forEach((child) => {
      try {
        child.kill();
      } catch (err) {
        logger.error({ err }, "Failed to kill process");
      }
    });
    managed.processes = [];
    managed.info = managed.info.map((info) => ({ ...info, status: "STOPPED" }));
    this.emit("status", { id, status: "STOPPED" });
  }

  async restart(id: string) {
    const managed = this.registry.get(id);
    if (!managed) throw new Error("Process not found");
    await this.stop(id);
    this.spawnInstances(id, managed);
  }

  async remove(id: string) {
    await this.stop(id);
    this.registry.delete(id);
    this.emit("status", { id, status: "STOPPED" });
  }

  private spawnInstances(id: string, managed: ManagedProcess) {
    for (let i = 0; i < managed.config.instances; i++) {
      const child = spawn(managed.config.command, {
        cwd: managed.config.cwd,
        env: { ...process.env, ...managed.config.env },
        shell: true,
        stdio: ["ignore", "pipe", "pipe"]
      });

      const info: ProcessInfo = {
        pid: child.pid ?? 0,
        status: "ONLINE",
        startedAt: new Date(),
        restarts: 0
      };
      managed.processes.push(child);
      managed.info.push(info);

      this.emit("status", { id, status: "ONLINE", pid: info.pid });

      child.stdout?.on("data", (chunk) => {
        this.emit("log", { id, type: "stdout", message: chunk.toString() });
      });
      child.stderr?.on("data", (chunk) => {
        this.emit("log", { id, type: "stderr", message: chunk.toString() });
      });

      child.on("exit", (code, signal) => {
        logger.warn({ id, code, signal }, "Process exited");
        info.status = "ERRORED";
        this.emit("status", { id, status: "ERRORED", code, signal });
        if (managed.config.autoRestart) {
          info.restarts += 1;
          info.status = "RESTARTING";
          this.emit("status", { id, status: "RESTARTING" });
          setTimeout(() => this.restart(id), 1000);
        }
      });
    }
  }
}

export const processManager = new ProcessManager();
