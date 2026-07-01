"use client";

import { FormEvent, useState } from "react";
import type { ListingCategory } from "@/lib/types";

export type ListingFormValues = {
  name: string;
  category: ListingCategory;
  area: string;
  address: string;
  description: string;
  priceRange: "$" | "$$" | "$$$";
  openingHours: string;
  capacity: number;
};

const emptyValues: ListingFormValues = {
  name: "",
  category: "salon",
  area: "",
  address: "",
  description: "",
  priceRange: "$$",
  openingHours: "",
  capacity: 20
};

type Props = {
  initial?: ListingFormValues;
  submitLabel?: string;
  onCancel?: () => void;
  onCreate: (payload: ListingFormValues) => Promise<void>;
};

export const CreateListingForm = ({ initial, submitLabel, onCancel, onCreate }: Props) => {
  const [values, setValues] = useState<ListingFormValues>(initial ?? emptyValues);
  const isEditing = Boolean(initial);

  const update = <K extends keyof ListingFormValues>(key: K, value: ListingFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onCreate(values);
    if (!isEditing) {
      setValues(emptyValues);
    }
  };

  return (
    <form className="stack" onSubmit={submit}>
      <input
        required
        placeholder="Business/Event name"
        value={values.name}
        onChange={(e) => update("name", e.target.value)}
      />
      <select value={values.category} onChange={(e) => update("category", e.target.value as ListingCategory)}>
        <option value="salon">Salon</option>
        <option value="eatery">Eatery</option>
        <option value="event">Event</option>
      </select>
      <input required placeholder="Area" value={values.area} onChange={(e) => update("area", e.target.value)} />
      <input
        required
        placeholder="Address"
        value={values.address}
        onChange={(e) => update("address", e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={values.description}
        onChange={(e) => update("description", e.target.value)}
      />
      <select
        value={values.priceRange}
        onChange={(e) => update("priceRange", e.target.value as "$" | "$$" | "$$$")}
      >
        <option value="$">$</option>
        <option value="$$">$$</option>
        <option value="$$$">$$$</option>
      </select>
      <input
        placeholder="Opening hours"
        value={values.openingHours}
        onChange={(e) => update("openingHours", e.target.value)}
      />
      <input
        required
        type="number"
        min={1}
        value={values.capacity}
        onChange={(e) => update("capacity", Number(e.target.value))}
      />
      <div className="row">
        <button type="submit" className="cta-btn">
          {submitLabel ?? "Create listing"}
        </button>
        {onCancel ? (
          <button type="button" className="ghost-btn" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};
