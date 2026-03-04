"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { ReservationForm } from "@/features/reservations/ReservationForm";
import type { Listing } from "@/lib/types";
import { listingService } from "@/services/listingService";
import { reservationService } from "@/services/reservationService";

export default function ListingDetailPage() {
  const params = useParams<{ listingId: string }>();
  const listingId = params.listingId;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await listingService.getById(listingId);
        setListing(response);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      void loadListing();
    }
  }, [listingId]);

  const book = async (payload: {
    listingId: string;
    scheduledFor: string;
    partySize: number;
    note?: string;
  }) => {
    setMessage(null);
    setError(null);
    try {
      await reservationService.create(payload);
      setMessage("Reservation created successfully.");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell title="Place details" subtitle="Review details before making a reservation.">
        <Link href="/discover" className="ghost-link inline-link">
          Back to discover
        </Link>

        {loading ? (
          <Card>
            <Spinner label="Loading listing details" />
          </Card>
        ) : null}

        {!loading && !listing ? <Card>{error ? <p className="error">{error}</p> : <p>Listing not found.</p>}</Card> : null}

        {listing ? (
          <section className="grid grid-2">
            <Card>
              <div className="pill-row">
                <span className="pill">{listing.category.toUpperCase()}</span>
                <span className="pill">{listing.area}</span>
                <span className="pill muted-pill">{listing.priceRange}</span>
              </div>
              <h2>{listing.name}</h2>
              <p>{listing.description || "No description available."}</p>
              <div className="detail-list">
                <div>
                  <strong>Address</strong>
                  <p className="muted-text">{listing.address}</p>
                </div>
                <div>
                  <strong>Opening hours</strong>
                  <p className="muted-text">{listing.openingHours || "Not specified"}</p>
                </div>
                <div>
                  <strong>Capacity</strong>
                  <p className="muted-text">{listing.capacity}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h2>Book now</h2>
              <p className="muted-text">Choose date/time and confirm your reservation.</p>
              <ReservationForm listingId={listing._id} onReserve={book} submitLabel="Create reservation" />
              {message ? <p className="success">{message}</p> : null}
              {error ? <p className="error">{error}</p> : null}
            </Card>
          </section>
        ) : null}
      </AppShell>
    </ProtectedRoute>
  );
}
