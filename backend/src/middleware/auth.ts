import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/authService.js";
import { HttpError } from "../utils/httpError.js";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email: string;
        role: "customer" | "owner" | "admin";
      };
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    next(new HttpError(401, "Missing or invalid authorization token"));
    return;
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();

  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
};
