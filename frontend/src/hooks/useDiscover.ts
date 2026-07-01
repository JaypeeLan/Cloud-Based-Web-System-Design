"use client";

import { useEffect, useState } from "react";
import type { Listing, ListingCategory } from "@/lib/types";
import { listingService } from "@/services/listingService";

const PAGE_SIZE = 12;

type SearchParams = { area?: string; category?: ListingCategory; q?: string };

export const useDiscover = (defaultArea?: string) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastParams, setLastParams] = useState<SearchParams>({});

  const runSearch = async (params: SearchParams, targetPage: number) => {
    setLoading(true);
    const result = await listingService.search({ ...params, page: targetPage, limit: PAGE_SIZE });
    setListings(result.items);
    setPage(result.page);
    setTotalPages(result.totalPages);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    setLastParams({ area: defaultArea || undefined });
    void runSearch({ area: defaultArea || undefined }, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultArea]);

  const search = async (params: SearchParams) => {
    setLastParams(params);
    await runSearch(params, 1);
  };

  const goToPage = async (targetPage: number) => {
    await runSearch(lastParams, targetPage);
  };

  const reload = async () => {
    await runSearch(lastParams, page);
  };

  return { listings, loading, page, totalPages, total, search, goToPage, reload };
};
