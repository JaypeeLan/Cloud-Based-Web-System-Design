"use client";

import Link from "next/link";
import type { Listing } from "@/lib/types";

type Props = {
  listing: Listing;
};

export const ListingCard = ({ listing }: Props) => {
  return (
    <li className="listing-item hover-lift">
      <div className="pill-row listing-meta-row">
        <span className="pill">{listing.category.toUpperCase()}</span>
        <span className="pill">{listing.area}</span>
        <span className="pill muted-pill">{listing.priceRange}</span>
      </div>
      <strong>{listing.name}</strong>
      <p>{listing.description || "No description yet."}</p>
      <small className="muted-text">{listing.address}</small>
      <small className="muted-text">Capacity {listing.capacity}</small>
      <Link className="cta-btn" href={`/discover/${listing._id}`}>
        View details & book
      </Link>
    </li>
  );
};
