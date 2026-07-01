"use client";

import { useEffect, useState } from "react";
import type { Reservation } from "@/lib/types";
import { reservationService } from "@/services/reservationService";

const PAGE_SIZE = 10;

export const useOwnerReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async (targetPage = 1) => {
    setLoading(true);
    const result = await reservationService.owner({ page: targetPage, limit: PAGE_SIZE });
    setReservations(result.items);
    setPage(result.page);
    setTotalPages(result.totalPages);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    void load(1);
  }, []);

  const updateStatus = async (reservationId: string, status: Reservation["status"]) => {
    await reservationService.updateStatus(reservationId, status);
    await load(page);
  };

  return { reservations, loading, page, totalPages, total, goToPage: load, reload: () => load(page), updateStatus };
};
