export type UserRole = "customer" | "owner" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
};

export type ListingCategory = "salon" | "eatery" | "event";

export type Listing = {
  _id: string;
  ownerId: string;
  name: string;
  category: ListingCategory;
  area: string;
  address: string;
  description: string;
  priceRange: "$" | "$$" | "$$$";
  openingHours: string;
  capacity: number;
  active: boolean;
};

export type Reservation = {
  _id: string;
  listingId: Listing | string;
  customerId: User | string;
  scheduledFor: string;
  partySize: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  note: string;
};
