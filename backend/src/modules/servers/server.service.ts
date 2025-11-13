import { prisma } from "@/config/prisma";
import type { ServerInput } from "./server.types";
import { NotFoundError } from "@/utils/errors";

export class ServerService {
  async list() {
    return prisma.server.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        host: true,
        description: true,
        agentUrl: true,
        isLocal: true,
        createdAt: true
      }
    });
  }

  async create(data: ServerInput) {
    return prisma.server.create({ data });
  }

  async update(id: string, data: Partial<ServerInput>) {
    const server = await prisma.server.findUnique({ where: { id } });
    if (!server) throw NotFoundError("Server not found");
    return prisma.server.update({ where: { id }, data });
  }

  async remove(id: string) {
    await prisma.botProcess.deleteMany({ where: { serverId: id } });
    return prisma.server.delete({ where: { id } });
  }
}
