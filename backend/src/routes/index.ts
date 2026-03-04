import { Router } from "express";
import { health } from "../controllers/healthController.js";
import { authRouter } from "./authRoutes.js";
import { listingRouter } from "./listingRoutes.js";
import { reservationRouter } from "./reservationRoutes.js";

export const apiRouter = Router();

apiRouter.get("/health", health);
apiRouter.use("/auth", authRouter);
apiRouter.use("/listings", listingRouter);
apiRouter.use("/reservations", reservationRouter);
