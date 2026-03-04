import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ListingModel } from "../models/Listing.js";
import { ReservationModel } from "../models/Reservation.js";
import { success } from "../utils/apiResponse.js";
import { HttpError } from "../utils/httpError.js";

const createReservationSchema = z.object({
  listingId: z.string().min(1),
  scheduledFor: z.coerce.date(),
  partySize: z.coerce.number().min(1).max(20),
  note: z.string().optional()
});

const updateStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"])
});

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createReservationSchema.parse(req.body);
    const listing = await ListingModel.findById(payload.listingId);

    if (!listing || !listing.active) {
      throw new HttpError(404, "Listing not available");
    }

    if (payload.partySize > listing.capacity) {
      throw new HttpError(400, `Party size exceeds capacity of ${listing.capacity}`);
    }

    const reservation = await ReservationModel.create({
      listingId: payload.listingId,
      customerId: req.auth?.userId,
      scheduledFor: payload.scheduledFor,
      partySize: payload.partySize,
      note: payload.note ?? ""
    });

    res.status(201).json(success(reservation, "Reservation created"));
  } catch (error) {
    next(error);
  }
};

export const listMyReservations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservations = await ReservationModel.find({ customerId: req.auth?.userId })
      .populate("listingId", "name category area address")
      .sort({ scheduledFor: -1 })
      .limit(120);

    res.json(success(reservations));
  } catch (error) {
    next(error);
  }
};

export const listOwnerReservations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listings = await ListingModel.find({ ownerId: req.auth?.userId }).select("_id");
    const listingIds = listings.map((listing) => listing._id);

    const reservations = await ReservationModel.find({ listingId: { $in: listingIds } })
      .populate("listingId", "name category area")
      .populate("customerId", "name email")
      .sort({ scheduledFor: -1 })
      .limit(120);

    res.json(success(reservations));
  } catch (error) {
    next(error);
  }
};

export const updateReservationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = updateStatusSchema.parse(req.body);
    const reservation = await ReservationModel.findById(req.params.reservationId);

    if (!reservation) {
      throw new HttpError(404, "Reservation not found");
    }

    const listing = await ListingModel.findById(reservation.listingId);

    if (!listing || listing.ownerId.toString() !== req.auth?.userId) {
      throw new HttpError(403, "Not authorized to update this reservation");
    }

    reservation.status = payload.status;
    await reservation.save();

    res.json(success(reservation, "Reservation status updated"));
  } catch (error) {
    next(error);
  }
};
