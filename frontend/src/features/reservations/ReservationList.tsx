"use client";

import Link from "next/link";
import type { Reservation } from "@/lib/types";

type Props = {
  reservations: Reservation[];
};

export const ReservationList = ({ reservations }: Props) => {
  if (reservations.length === 0) {
    return (
      <div className="empty-state">
        <p>You don&apos;t have any reservations yet.</p>
        <p className="muted-text">Browse listings and book a salon, eatery, or event to see it tracked here.</p>
        <Link href="/discover" className="cta-btn">
          Browse listings
        </Link>
      </div>
    );
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
              Party: {reservation.partySize} | Status:{" "}
              <span className={`status-badge status-${reservation.status}`}>
                {reservation.status.toUpperCase()}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
};
