"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { AuthPanel } from "@/features/auth/AuthPanel";
import { useAuth } from "@/providers/AuthProvider";

export default function AuthPage() {
  const { user, loading, login, register } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPath, setNextPath] = useState("/discover");
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const parsedNext = new URLSearchParams(window.location.search).get("next");
    if (parsedNext) {
      setNextPath(parsedNext);
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace(nextPath);
    }
  }, [loading, user, nextPath, router]);

  if (loading) {
    return (
      <main className="page center-page">
        <Spinner label="Preparing authentication" />
      </main>
    );
  }

  const onLogin = async (email: string, password: string) => {
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      router.replace(nextPath);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onRegister = async (name: string, location: string, email: string, password: string) => {
    setBusy(true);
    setError(null);
    try {
      await register(name, location, email, password);
      router.replace(nextPath);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AuthPanel busy={busy} onLogin={onLogin} onRegister={onRegister} />
      {error ? <p className="error floating-error">{error}</p> : null}
    </>
  );
}
