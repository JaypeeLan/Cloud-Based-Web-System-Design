import { request } from "@/lib/api";
import type { Listing, ListingCategory } from "@/lib/types";

type CreateListingInput = {
  name: string;
  category: ListingCategory;
  area: string;
  address: string;
  description: string;
  priceRange: "$" | "$$" | "$$$";
  openingHours: string;
  capacity: number;
};

export const listingService = {
  search: (params: { area?: string; category?: ListingCategory; q?: string }) => {
    const query = new URLSearchParams();
    if (params.area) query.set("area", params.area);
    if (params.category) query.set("category", params.category);
    if (params.q) query.set("q", params.q);
    const queryString = query.toString();
    return request<Listing[]>(`/listings${queryString ? `?${queryString}` : ""}`);
  },

  create: (payload: CreateListingInput) =>
    request<Listing>("/listings", {
      method: "POST",
      body: payload
    }),

  mine: () => request<Listing[]>("/listings/mine"),

  getById: (listingId: string) => request<Listing>(`/listings/${listingId}`)
};
