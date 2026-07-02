"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Reservation } from "@/lib/types";

type Props = {
  reservations: Reservation[];
  onUpdateStatus: (reservationId: string, status: Reservation["status"]) => Promise<void>;
};

const nextActions: Record<Reservation["status"], { label: string; status: Reservation["status"] }[]> = {
  pending: [
    { label: "Confirm", status: "confirmed" },
    { label: "Decline", status: "cancelled" }
  ],
  confirmed: [
    { label: "Mark completed", status: "completed" },
    { label: "Cancel", status: "cancelled" }
  ],
  cancelled: [],
  completed: []
};

export const OwnerReservationList = ({ reservations, onUpdateStatus }: Props) => {
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const handleUpdate = async (reservationId: string, status: Reservation["status"]) => {
    const key = `${reservationId}:${status}`;
    setPendingAction(key);
    try {
      await onUpdateStatus(reservationId, status);
    } finally {
      setPendingAction(null);
    }
  };

  if (reservations.length === 0) {
    return <p className="muted-text">No incoming reservations yet. Bookings against your listings will show up here.</p>;
  }

  return (
    <ul className="stack list">
      {reservations.map((reservation) => {
        const listingName =
          typeof reservation.listingId === "string" ? reservation.listingId : reservation.listingId.name;
        const customerName =
          typeof reservation.customerId === "string" ? reservation.customerId : reservation.customerId.name;

        return (
          <li key={reservation._id} className="reservation-item">
            <strong>{listingName}</strong>
            <span>{customerName}</span>
            <span>{new Date(reservation.scheduledFor).toLocaleString()}</span>
            <span>
              Party: {reservation.partySize} | Status:{" "}
              <span className={`status-badge status-${reservation.status}`}>
                {reservation.status.toUpperCase()}
              </span>
            </span>
            {nextActions[reservation.status].length > 0 ? (
              <div className="row">
                {nextActions[reservation.status].map((action) => {
                  const actionKey = `${reservation._id}:${action.status}`;

                  return (
                    <Button
                      key={action.status}
                      variant="ghost"
                      loading={pendingAction === actionKey}
                      loadingLabel={action.label}
                      disabled={pendingAction !== null && pendingAction !== actionKey}
                      onClick={() => void handleUpdate(reservation._id, action.status)}
                    >
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};
