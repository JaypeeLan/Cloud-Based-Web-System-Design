"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { ReservationList } from "@/features/reservations/ReservationList";
import { useReservations } from "@/hooks/useReservations";

export default function ReservationsPage() {
  const { reservations, loading, page, totalPages, total, goToPage, reload } = useReservations();

  return (
    <ProtectedRoute>
      <AppShell title="Reservations" subtitle="Track your upcoming and past bookings.">
        <Card>
          <div className="row between">
            <h2>My reservations</h2>
            <Button variant="ghost" loading={loading} loadingLabel="Refreshing..." onClick={() => void reload()}>
              Refresh
            </Button>
          </div>
          {loading ? (
            <div className="grid grid-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <>
              <ReservationList reservations={reservations} />
              <Pagination page={page} totalPages={totalPages} total={total} onPageChange={goToPage} />
            </>
          )}
        </Card>
      </AppShell>
    </ProtectedRoute>
  );
}
