import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../utils/httpError.js";

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ status: "error", message: "Route not found" });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    res.status(400).json({ status: "error", message: "Validation failed", errors: err.flatten() });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ status: "error", message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ status: "error", message: "Internal server error" });
};
