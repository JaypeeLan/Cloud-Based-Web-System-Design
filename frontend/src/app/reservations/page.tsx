"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { ReservationList } from "@/features/reservations/ReservationList";
import { useReservations } from "@/hooks/useReservations";

export default function ReservationsPage() {
  const { reservations, loading, reload } = useReservations();

  return (
    <ProtectedRoute>
      <AppShell title="Reservations" subtitle="Track your upcoming and past bookings.">
        <Card>
          <div className="row between">
            <h2>My reservations</h2>
            <button className="ghost-btn" onClick={() => void reload()}>
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="grid grid-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <ReservationList reservations={reservations} />
          )}
        </Card>
      </AppShell>
    </ProtectedRoute>
  );
}
