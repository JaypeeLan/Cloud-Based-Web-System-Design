import { Router } from "express";
import {
  createReservation,
  listMyReservations,
  listOwnerReservations,
  updateReservationStatus
} from "../controllers/reservationController.js";
import { requireAuth } from "../middleware/auth.js";

export const reservationRouter = Router();

reservationRouter.use(requireAuth);
reservationRouter.post("/", createReservation);
reservationRouter.get("/mine", listMyReservations);
reservationRouter.get("/owner", listOwnerReservations);
reservationRouter.patch("/:reservationId/status", updateReservationStatus);
