"use client";

import { useEffect, useState } from "react";
import type { Listing, ListingCategory } from "@/lib/types";
import { listingService } from "@/services/listingService";

const PAGE_SIZE = 10;

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

type UpdateListingPayload = Partial<CreateListingPayload> & { active?: boolean };

export const useHost = () => {
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadMine = async (targetPage = 1) => {
    setLoading(true);
    const result = await listingService.mine({ page: targetPage, limit: PAGE_SIZE });
    setMyListings(result.items);
    setPage(result.page);
    setTotalPages(result.totalPages);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    void loadMine(1);
  }, []);

  const createListing = async (payload: CreateListingPayload) => {
    await listingService.create(payload);
    await loadMine(1);
  };

  const updateListing = async (listingId: string, payload: UpdateListingPayload) => {
    await listingService.update(listingId, payload);
    await loadMine(page);
  };

  return {
    myListings,
    loading,
    page,
    totalPages,
    total,
    createListing,
    updateListing,
    goToPage: loadMine,
    reload: () => loadMine(page)
  };
};
