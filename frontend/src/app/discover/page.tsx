"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { ListingCard } from "@/features/listings/ListingCard";
import { SearchBar } from "@/features/listings/SearchBar";
import { useDiscover } from "@/hooks/useDiscover";
import { useAuth } from "@/providers/AuthProvider";

export default function DiscoverPage() {
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { listings, loading, page, totalPages, total, search, goToPage, reload } = useDiscover(user?.location);

  const runSearch = async (params: { area?: string; category?: "salon" | "eatery" | "event"; q?: string }) => {
    try {
      setError(null);
      await search({
        ...params,
        area: params.area || user?.location || undefined
      });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const reloadListings = async () => {
    try {
      setError(null);
      await reload();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell
        title="Discover"
        subtitle={`Search and compare places around ${user?.location ?? "your area"}.`}
      >
        <Card>
          <div className="row between discover-head">
            <div>
              <h2>Find places by area</h2>
              <p className="muted-text">
                Browse listings first, then open a listing to review details and book.
              </p>
            </div>
            <button className="ghost-btn" onClick={() => void reloadListings()}>
              Reload
            </button>
          </div>
          <SearchBar onSearch={runSearch} />
          {error ? <p className="error">{error}</p> : null}
        </Card>

        <Card>
          <div className="row between">
            <h2>Results</h2>
            <span className="muted-text">{total} places</span>
          </div>

          {loading ? (
            <div className="grid grid-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : listings.length === 0 ? (
            <p className="muted-text">No places match this search. Try a different area or category.</p>
          ) : (
            <>
              <ul className="grid grid-3 list">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </ul>
              <Pagination page={page} totalPages={totalPages} total={total} onPageChange={goToPage} />
            </>
          )}
        </Card>
      </AppShell>
    </ProtectedRoute>
  );
}
