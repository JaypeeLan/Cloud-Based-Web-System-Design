import { request } from "@/lib/api";
import type { Paginated, Reservation } from "@/lib/types";

type CreateReservationInput = {
  listingId: string;
  scheduledFor: string;
  partySize: number;
  note?: string;
};

type PageParams = { page?: number; limit?: number };

const toQuery = (params: PageParams) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const reservationService = {
  create: (payload: CreateReservationInput) =>
    request<Reservation>("/reservations", {
      method: "POST",
      body: payload
    }),

  mine: (params: PageParams = {}) => request<Paginated<Reservation>>(`/reservations/mine${toQuery(params)}`),

  owner: (params: PageParams = {}) => request<Paginated<Reservation>>(`/reservations/owner${toQuery(params)}`),

  updateStatus: (reservationId: string, status: Reservation["status"]) =>
    request<Reservation>(`/reservations/${reservationId}/status`, {
      method: "PATCH",
      body: { status }
    })
};
