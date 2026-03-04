"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { CreateListingForm } from "@/features/listings/CreateListingForm";
import { useHost } from "@/hooks/useHost";

export default function HostPage() {
  const { myListings, loading, createListing } = useHost();

  return (
    <ProtectedRoute>
      <AppShell title="Host" subtitle="Create and manage your salon, eatery, or event listings.">
        <section className="grid grid-2">
          <Card>
            <h2>Create listing</h2>
            <CreateListingForm onCreate={createListing} />
          </Card>

          <Card>
            <h2>My listings</h2>
            {loading ? (
              <div className="stack">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : (
              <ul className="stack list">
                {myListings.map((listing) => (
                  <li key={listing._id} className="listing-item">
                    <strong>{listing.name}</strong>
                    <span>
                      {listing.category.toUpperCase()} | {listing.area}
                    </span>
                    <small>{listing.address}</small>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </AppShell>
    </ProtectedRoute>
  );
}
