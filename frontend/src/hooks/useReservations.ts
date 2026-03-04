"use client";

import { useEffect, useState } from "react";
import type { Reservation } from "@/lib/types";
import { reservationService } from "@/services/reservationService";

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await reservationService.mine();
    setReservations(data);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  return { reservations, loading, reload: load };
};
