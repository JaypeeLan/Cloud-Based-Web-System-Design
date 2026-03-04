"use client";

import { FormEvent, useEffect, useState } from "react";
import type { User } from "@/lib/types";

type Props = {
  user: User;
  open: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (payload: { name?: string; location?: string; password?: string }) => Promise<void>;
};

export const ProfileModal = ({ user, open, busy, error, onClose, onSave }: Props) => {
  const [name, setName] = useState(user.name);
  const [location, setLocation] = useState(user.location);
  const [password, setPassword] = useState("");

  useEffect(() => {
    setName(user.name);
    setLocation(user.location);
    setPassword("");
  }, [user]);

  if (!open) {
    return null;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onSave({
      name,
      location,
      password: password || undefined
    });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Profile settings">
      <section className="modal-panel fade-up">
        <div className="row between">
          <h3>Profile Settings</h3>
          <button className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="stack" onSubmit={submit}>
          <label className="stack">
            <span>Email (read-only)</span>
            <input value={user.email} readOnly />
          </label>

          <label className="stack">
            <span>Name</span>
            <input required value={name} onChange={(event) => setName(event.target.value)} />
          </label>

          <label className="stack">
            <span>Location</span>
            <input required value={location} onChange={(event) => setLocation(event.target.value)} />
          </label>

          <label className="stack">
            <span>New password (optional)</span>
            <input
              type="password"
              minLength={8}
              placeholder="Leave blank to keep current password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button type="submit" className="cta-btn" disabled={busy}>
            {busy ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>
    </div>
  );
};
