"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void | Promise<void>;
};

export const Pagination = ({ page, totalPages, total, onPageChange }: Props) => {
  const [pending, setPending] = useState<"prev" | "next" | null>(null);

  if (totalPages <= 1) {
    return null;
  }

  const changePage = async (target: number, direction: "prev" | "next") => {
    setPending(direction);
    try {
      await onPageChange(target);
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="row between pagination">
      <span className="muted-text">
        Page {page} of {totalPages} · {total} total
      </span>
      <div className="row">
        <Button
          variant="ghost"
          disabled={page <= 1}
          loading={pending === "prev"}
          loadingLabel="Previous"
          onClick={() => void changePage(page - 1, "prev")}
        >
          Previous
        </Button>
        <Button
          variant="ghost"
          disabled={page >= totalPages}
          loading={pending === "next"}
          loadingLabel="Next"
          onClick={() => void changePage(page + 1, "next")}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
