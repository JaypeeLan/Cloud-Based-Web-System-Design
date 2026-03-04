"use client";

import { FormEvent, useState } from "react";
import type { ListingCategory } from "@/lib/types";

type Props = {
  onCreate: (payload: {
    name: string;
    category: ListingCategory;
    area: string;
    address: string;
    description: string;
    priceRange: "$" | "$$" | "$$$";
    openingHours: string;
    capacity: number;
  }) => Promise<void>;
};

export const CreateListingForm = ({ onCreate }: Props) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ListingCategory>("salon");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [priceRange, setPriceRange] = useState<"$" | "$$" | "$$$">("$$");
  const [openingHours, setOpeningHours] = useState("");
  const [capacity, setCapacity] = useState(20);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onCreate({
      name,
      category,
      area,
      address,
      description,
      priceRange,
      openingHours,
      capacity
    });
    setName("");
    setArea("");
    setAddress("");
    setDescription("");
    setOpeningHours("");
    setCapacity(20);
  };

  return (
    <form className="stack" onSubmit={submit}>
      <input required placeholder="Business/Event name" value={name} onChange={(e) => setName(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value as ListingCategory)}>
        <option value="salon">Salon</option>
        <option value="eatery">Eatery</option>
        <option value="event">Event</option>
      </select>
      <input required placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)} />
      <input required placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <select value={priceRange} onChange={(e) => setPriceRange(e.target.value as "$" | "$$" | "$$$")}>
        <option value="$">$</option>
        <option value="$$">$$</option>
        <option value="$$$">$$$</option>
      </select>
      <input
        placeholder="Opening hours"
        value={openingHours}
        onChange={(e) => setOpeningHours(e.target.value)}
      />
      <input
        required
        type="number"
        min={1}
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value))}
      />
      <button type="submit" className="cta-btn">
        Create listing
      </button>
    </form>
  );
};
