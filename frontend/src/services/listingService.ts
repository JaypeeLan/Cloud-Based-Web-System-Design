import { request } from "@/lib/api";
import type { Listing, ListingCategory, Paginated } from "@/lib/types";

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

type UpdateListingInput = Partial<CreateListingInput> & { active?: boolean };

export const listingService = {
  search: (params: { area?: string; category?: ListingCategory; q?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.area) query.set("area", params.area);
    if (params.category) query.set("category", params.category);
    if (params.q) query.set("q", params.q);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const queryString = query.toString();
    return request<Paginated<Listing>>(`/listings${queryString ? `?${queryString}` : ""}`);
  },

  create: (payload: CreateListingInput) =>
    request<Listing>("/listings", {
      method: "POST",
      body: payload
    }),

  update: (listingId: string, payload: UpdateListingInput) =>
    request<Listing>(`/listings/${listingId}`, {
      method: "PATCH",
      body: payload
    }),

  mine: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const queryString = query.toString();
    return request<Paginated<Listing>>(`/listings/mine${queryString ? `?${queryString}` : ""}`);
  },

  getById: (listingId: string) => request<Listing>(`/listings/${listingId}`)
};
