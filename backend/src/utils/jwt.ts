import jwt from "jsonwebtoken";
import env from "@/config/env";

export interface JwtPayload {
  sub: string;
  role: "ADMIN" | "VIEWER";
}

export const signToken = (payload: JwtPayload, expiresIn = "12h") =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn });

export const verifyToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;
