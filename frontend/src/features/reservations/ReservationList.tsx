"use client";

import type { Reservation } from "@/lib/types";

type Props = {
  reservations: Reservation[];
};

export const ReservationList = ({ reservations }: Props) => {
  if (reservations.length === 0) {
    return <p>No reservations yet.</p>;
  }

  return (
    <ul className="stack list">
      {reservations.map((reservation) => {
        const listingName =
          typeof reservation.listingId === "string"
            ? reservation.listingId
            : reservation.listingId.name;

        return (
          <li key={reservation._id} className="reservation-item">
            <strong>{listingName}</strong>
            <span>{new Date(reservation.scheduledFor).toLocaleString()}</span>
            <span>
              Party: {reservation.partySize} | Status: {reservation.status.toUpperCase()}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
