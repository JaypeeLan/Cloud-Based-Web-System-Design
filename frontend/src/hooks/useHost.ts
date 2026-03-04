"use client";

import { useEffect, useState } from "react";
import type { Listing, ListingCategory } from "@/lib/types";
import { listingService } from "@/services/listingService";

type CreateListingPayload = {
  name: string;
  category: ListingCategory;
  area: string;
  address: string;
  description: string;
  priceRange: "$" | "$$" | "$$$";
  openingHours: string;
  capacity: number;
};

export const useHost = () => {
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMine = async () => {
    setLoading(true);
    const data = await listingService.mine();
    setMyListings(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadMine();
  }, []);

  const createListing = async (payload: CreateListingPayload) => {
    await listingService.create(payload);
    await loadMine();
  };

  return { myListings, loading, createListing, reload: loadMine };
};
