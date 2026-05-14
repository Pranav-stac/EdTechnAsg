import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { AppError } from "./errors";
import { verifyToken } from "./jwt";

export type AuthedRequest = Request & {
  user?: { id: string; role: UserRole; name: string };
};

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return next(new AppError(401, "UNAUTHORIZED", "Authentication required"));
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role, name: payload.name };
    return next();
  } catch {
    return next(new AppError(401, "UNAUTHORIZED", "Invalid or expired token"));
  }
}

export function requireRole(role: UserRole) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return next(new AppError(403, "FORBIDDEN", "Insufficient permissions"));
    }
    return next();
  };
}
