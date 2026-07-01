"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const parsedToken = new URLSearchParams(window.location.search).get("token");
    if (parsedToken) {
      setToken(parsedToken);
    }
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setBusy(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.replace("/auth"), 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page auth-page">
      <section className="auth-shell fade-up">
        <aside className="auth-aside">
          <p className="eyebrow">Account Recovery</p>
          <h1>Choose a new password.</h1>
          <p>Use at least 8 characters. You will be redirected to sign in once the update completes.</p>
        </aside>

        <article className="auth-panel slide-in">
          <Link href="/auth" className="auth-back-link">
            Back to login
          </Link>
          <h2 className="auth-panel-title">Set new password</h2>

          {success ? (
            <p className="auth-success">Password updated. Redirecting to login...</p>
          ) : (
            <form className="stack" onSubmit={submit}>
              <input
                required
                placeholder="Reset token"
                value={token}
                onChange={(event) => setToken(event.target.value)}
              />
              <input
                required
                type="password"
                minLength={8}
                placeholder="New password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <input
                required
                type="password"
                minLength={8}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <button type="submit" className="cta-btn" disabled={busy}>
                {busy ? "Updating..." : "Update password"}
              </button>
            </form>
          )}

          {error ? <p className="error">{error}</p> : null}
        </article>
      </section>
    </main>
  );
}
