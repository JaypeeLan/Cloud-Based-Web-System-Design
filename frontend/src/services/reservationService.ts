import { request } from "@/lib/api";
import type { Reservation } from "@/lib/types";

type CreateReservationInput = {
  listingId: string;
  scheduledFor: string;
  partySize: number;
  note?: string;
};

export const reservationService = {
  create: (payload: CreateReservationInput) =>
    request<Reservation>("/reservations", {
      method: "POST",
      body: payload
    }),

  mine: () => request<Reservation[]>("/reservations/mine")
};
