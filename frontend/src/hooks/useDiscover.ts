"use client";

import { useEffect, useState } from "react";
import type { Listing, ListingCategory } from "@/lib/types";
import { listingService } from "@/services/listingService";

export const useDiscover = (defaultArea?: string) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInitial = async () => {
    setLoading(true);
    const results = await listingService.search({ area: defaultArea || undefined });
    setListings(results);
    setLoading(false);
  };

  useEffect(() => {
    void loadInitial();
  }, [defaultArea]);

  const search = async (params: { area?: string; category?: ListingCategory; q?: string }) => {
    setLoading(true);
    const results = await listingService.search(params);
    setListings(results);
    setLoading(false);
  };

  return { listings, loading, search, reload: loadInitial };
};
