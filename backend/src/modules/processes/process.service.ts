import { prisma } from "@/config/prisma";
import { processManager } from "@/services/processManager";
import { AgentClient } from "@/services/agentClient";
import { NotFoundError } from "@/utils/errors";
import type { ProcessCreateInput } from "./process.types";

const toEnvMap = (env: { key: string; value: string }[]) =>
  env.reduce<Record<string, string>>((acc, pair) => {
    acc[pair.key] = pair.value;
    return acc;
  }, {});

export class ProcessService {
  async create(data: ProcessCreateInput) {
    return prisma.botProcess.create({
      data: {
        serverId: data.serverId,
        name: data.name,
        command: data.command,
        cwd: data.cwd,
        env: data.env,
        instances: data.instances,
        autoRestart: data.autoRestart
      }
    });
  }

  async update(id: string, data: Partial<ProcessCreateInput>) {
    const bot = await this.get(id);
    const payload: any = {};

    if (data.serverId && data.serverId !== bot.serverId) payload.serverId = data.serverId;
    if (data.name !== undefined) payload.name = data.name;
    if (data.command !== undefined) payload.command = data.command;
    if (data.cwd !== undefined) payload.cwd = data.cwd;
    if (data.env !== undefined) payload.env = data.env;
    if (data.instances !== undefined) payload.instances = data.instances;
    if (data.autoRestart !== undefined) payload.autoRestart = data.autoRestart;

    return prisma.botProcess.update({ where: { id }, data: payload });
  }

  async listByServer(serverId: string) {
    return prisma.botProcess.findMany({
      where: { serverId },
      orderBy: { createdAt: "asc" }
    });
  }

  async get(id: string) {
    const bot = await prisma.botProcess.findUnique({ where: { id } });
    if (!bot) throw NotFoundError("Process not found");
    return bot;
  }

  async remove(id: string) {
    await prisma.botProcessHistory.deleteMany({ where: { processId: id } });
    await prisma.botProcess.delete({ where: { id } });
  }

  async start(id: string) {
    const bot = await this.get(id);
    const server = await prisma.server.findUnique({ where: { id: bot.serverId } });
    if (!server) throw NotFoundError("Server not found");

    if (server.isLocal) {
      await processManager.start({
        id: bot.id,
        name: bot.name,
        command: bot.command,
        cwd: bot.cwd,
        env: toEnvMap(bot.env as any),
        instances: bot.instances,
        autoRestart: bot.autoRestart
      });
    } else {
      const agent = new AgentClient(server.agentUrl, server.agentToken);
      await agent.startProcess(id);
    }

    await prisma.botProcess.update({
      where: { id },
      data: {
        status: "ONLINE",
        lastStartedAt: new Date(),
        restartCount: { increment: 1 }
      }
    });
    await prisma.botProcessHistory.create({
      data: { processId: id, status: "ONLINE", message: "Process started" }
    });
  }

  async stop(id: string) {
    const bot = await this.get(id);
    const server = await prisma.server.findUnique({ where: { id: bot.serverId } });
    if (!server) throw NotFoundError("Server not found");

    if (server.isLocal) {
      await processManager.stop(id);
    } else {
      const agent = new AgentClient(server.agentUrl, server.agentToken);
      await agent.stopProcess(id);
    }

    await prisma.botProcess.update({
      where: { id },
      data: {
        status: "STOPPED",
        lastStoppedAt: new Date()
      }
    });
    await prisma.botProcessHistory.create({
      data: { processId: id, status: "STOPPED", message: "Process stopped" }
    });
  }

  async restart(id: string) {
    const bot = await this.get(id);
    const server = await prisma.server.findUnique({ where: { id: bot.serverId } });
    if (!server) throw NotFoundError("Server not found");

    if (server.isLocal) {
      await processManager.restart(id);
    } else {
      const agent = new AgentClient(server.agentUrl, server.agentToken);
      await agent.restartProcess(id);
    }

    await prisma.botProcess.update({
      where: { id },
      data: {
        status: "RESTARTING",
        restartCount: { increment: 1 }
      }
    });
    await prisma.botProcessHistory.create({
      data: { processId: id, status: "RESTARTING", message: "Process restarted" }
    });
  }

  async delete(id: string) {
    await this.remove(id);
  }
}
