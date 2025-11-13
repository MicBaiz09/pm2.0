import { prisma } from "@/config/prisma";
import { verifyPassword, hashPassword } from "@/utils/hash";
import { signToken } from "@/utils/jwt";
import { UnauthorizedError, BadRequestError } from "@/utils/errors";
import type { LoginInput, RegisterInput } from "./auth.types";

export class AuthService {
  async login({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw UnauthorizedError();

    const valid = await verifyPassword(password, user.password);
    if (!valid) throw UnauthorizedError();

    const token = signToken({ sub: user.id, role: user.role });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async register(currentUserId: string, payload: RegisterInput) {
    const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
    if (!currentUser || currentUser.role !== "ADMIN") throw UnauthorizedError();

    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) throw BadRequestError("Email already in use");

    const password = await hashPassword(payload.password);
    const user = await prisma.user.create({
      data: { email: payload.email, password, role: payload.role }
    });

    return { id: user.id, email: user.email, role: user.role };
  }
}
