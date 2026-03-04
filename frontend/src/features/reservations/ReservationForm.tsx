"use client";

import { FormEvent, useState } from "react";

type Props = {
  listingId: string;
  onReserve: (payload: {
    listingId: string;
    scheduledFor: string;
    partySize: number;
    note?: string;
  }) => Promise<void>;
  submitLabel?: string;
};

export const ReservationForm = ({ listingId, onReserve, submitLabel = "Confirm reservation" }: Props) => {
  const [scheduledFor, setScheduledFor] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [note, setNote] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onReserve({
      listingId,
      scheduledFor,
      partySize,
      note: note || undefined
    });
    setScheduledFor("");
    setPartySize(1);
    setNote("");
  };

  return (
    <form className="stack" onSubmit={submit}>
      <input
        required
        type="datetime-local"
        value={scheduledFor}
        onChange={(event) => setScheduledFor(event.target.value)}
      />
      <input
        required
        type="number"
        min={1}
        max={20}
        value={partySize}
        onChange={(event) => setPartySize(Number(event.target.value))}
      />
      <textarea placeholder="Note (optional)" value={note} onChange={(event) => setNote(event.target.value)} />
      <button type="submit" className="cta-btn" disabled={!listingId}>
        {submitLabel}
      </button>
    </form>
  );
};
