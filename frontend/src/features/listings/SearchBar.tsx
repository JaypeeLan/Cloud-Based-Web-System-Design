"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ListingCategory } from "@/lib/types";

type Props = {
  onSearch: (params: { area?: string; category?: ListingCategory; q?: string }) => Promise<void>;
};

export const SearchBar = ({ onSearch }: Props) => {
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState<"" | ListingCategory>("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await onSearch({
        q: q || undefined,
        area: area || undefined,
        category: category || undefined
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="stack" onSubmit={submit}>
      <input placeholder="Search (name, address, keyword)" value={q} onChange={(e) => setQ(e.target.value)} />
      <input placeholder="Area (e.g. Lekki, Yaba, Ikeja)" value={area} onChange={(e) => setArea(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value as "" | ListingCategory)}>
        <option value="">All categories</option>
        <option value="salon">Salon</option>
        <option value="eatery">Eatery</option>
        <option value="event">Event</option>
      </select>
      <Button type="submit" variant="cta" loading={busy} loadingLabel="Searching...">
        Find places
      </Button>
    </form>
  );
};
