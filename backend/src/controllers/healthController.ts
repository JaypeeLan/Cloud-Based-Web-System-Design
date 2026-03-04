import type { Request, Response } from "express";

export const health = (_req: Request, res: Response) => {
  res.json({ status: "success", message: "LocalSpot Booker API is healthy", timestamp: new Date().toISOString() });
};
