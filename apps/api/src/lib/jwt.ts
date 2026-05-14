import jwt from "jsonwebtoken";
import { UserRole } from "@manzilchaser/shared";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export type AuthPayload = {
  sub: string;
  role: UserRole;
  name: string;
};

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}
