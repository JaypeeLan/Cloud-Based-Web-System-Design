"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { CreateListingForm, type ListingFormValues } from "@/features/listings/CreateListingForm";
import { OwnerReservationList } from "@/features/reservations/OwnerReservationList";
import { useHost } from "@/hooks/useHost";
import { useOwnerReservations } from "@/hooks/useOwnerReservations";
import type { Listing } from "@/lib/types";

export default function HostPage() {
  const { myListings, loading, page, totalPages, total, createListing, updateListing, goToPage } = useHost();
  const {
    reservations,
    loading: reservationsLoading,
    page: reservationsPage,
    totalPages: reservationsTotalPages,
    total: reservationsTotal,
    goToPage: goToReservationsPage,
    updateStatus
  } = useOwnerReservations();
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const startEditing = (listing: Listing) => setEditingListing(listing);
  const stopEditing = () => setEditingListing(null);

  const saveEdit = async (payload: ListingFormValues) => {
    if (!editingListing) return;
    await updateListing(editingListing._id, payload);
    setEditingListing(null);
  };

  return (
    <ProtectedRoute>
      <AppShell title="Host" subtitle="Create and manage your salon, eatery, or event listings.">
        <section className="grid grid-2">
          <Card>
            <h2>{editingListing ? "Edit listing" : "Create listing"}</h2>
            {editingListing ? (
              <CreateListingForm
                key={editingListing._id}
                initial={{
                  name: editingListing.name,
                  category: editingListing.category,
                  area: editingListing.area,
                  address: editingListing.address,
                  description: editingListing.description,
                  priceRange: editingListing.priceRange,
                  openingHours: editingListing.openingHours,
                  capacity: editingListing.capacity
                }}
                submitLabel="Save changes"
                onCancel={stopEditing}
                onCreate={saveEdit}
              />
            ) : (
              <CreateListingForm onCreate={createListing} />
            )}
          </Card>

          <Card>
            <div className="row between">
              <h2>My listings</h2>
              <span className="muted-text">{total} total</span>
            </div>
            {loading ? (
              <div className="stack">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : myListings.length === 0 ? (
              <p className="muted-text">
                You haven&apos;t created any listings yet. Fill out the form to add your first salon, eatery, or
                event.
              </p>
            ) : (
              <>
                <ul className="stack list">
                  {myListings.map((listing) => (
                    <li key={listing._id} className="listing-item">
                      <strong>{listing.name}</strong>
                      <span>
                        {listing.category.toUpperCase()} | {listing.area}
                      </span>
                      <small>{listing.address}</small>
                      <div className="row">
                        <button className="ghost-btn" onClick={() => startEditing(listing)}>
                          Edit
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <Pagination page={page} totalPages={totalPages} total={total} onPageChange={goToPage} />
              </>
            )}
          </Card>
        </section>

        <Card>
          <div className="row between">
            <h2>Incoming reservations</h2>
            <span className="muted-text">{reservationsTotal} total</span>
          </div>
          <p className="muted-text">Bookings made against your listings, across all your places.</p>
          {reservationsLoading ? (
            <div className="stack">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <>
              <OwnerReservationList reservations={reservations} onUpdateStatus={updateStatus} />
              <Pagination
                page={reservationsPage}
                totalPages={reservationsTotalPages}
                total={reservationsTotal}
                onPageChange={goToReservationsPage}
              />
            </>
          )}
        </Card>
      </AppShell>
    </ProtectedRoute>
  );
}
