"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

type AuthMode = "login" | "register" | "forgot";

type Props = {
  busy: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, location: string, email: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<{ resetUrl?: string } | null>;
};

export const AuthPanel = ({ busy, onLogin, onRegister, onForgotPassword }: Props) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setForgotMessage(null);
    setResetUrl(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (mode === "login") {
      await onLogin(email, password);
      return;
    }

    if (mode === "forgot") {
      const result = await onForgotPassword(email);
      setForgotMessage(
        "If that email is registered, password reset instructions have been sent."
      );
      setResetUrl(result?.resetUrl ?? null);
      return;
    }

    await onRegister(name, location, email, password);
  };

  return (
    <main className="page auth-page">
      <section className="auth-shell fade-up">
        <aside className="auth-aside">
          <p className="eyebrow">Professional Access</p>
          <h1>One account for discovery, booking, and hosting.</h1>
          <p>
            Join LocalSpot Booker to explore verified lifestyle businesses in your city and manage bookings
            with a streamlined workflow.
          </p>
          <ul className="auth-points">
            <li>Location-based default discovery</li>
            <li>Dedicated booking pages for each listing</li>
            <li>Profile settings with editable role and location</li>
          </ul>
        </aside>

        <article className="auth-panel slide-in">
          {mode === "forgot" ? (
            <>
              <button type="button" className="auth-back-link" onClick={() => switchMode("login")}>
                Back to login
              </button>
              <h2 className="auth-panel-title">Reset your password</h2>
              <p className="auth-panel-copy">
                Enter the email linked to your account and we will send reset instructions.
              </p>
            </>
          ) : (
            <div className="auth-tabs">
              <button type="button" className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>
                Login
              </button>
              <button
                type="button"
                className={mode === "register" ? "active" : ""}
                onClick={() => switchMode("register")}
              >
                Register
              </button>
            </div>
          )}

          <form className="stack" onSubmit={submit}>
            {mode === "register" ? (
              <>
                <input
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <input
                  required
                  placeholder="Default location (e.g. Lekki, Victoria Island)"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
              </>
            ) : null}

            {mode !== "login" || !forgotMessage ? (
              <input
                required
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            ) : null}

            {mode === "login" ? (
              <>
                <input
                  required
                  type="password"
                  minLength={8}
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button type="button" className="auth-inline-link" onClick={() => switchMode("forgot")}>
                  Forgot password?
                </button>
              </>
            ) : null}

            {mode === "forgot" && forgotMessage ? (
              <p className="auth-success">{forgotMessage}</p>
            ) : null}

            {resetUrl ? (
              <p className="auth-dev-link">
                Dev reset link:{" "}
                <a href={resetUrl}>{resetUrl}</a>
              </p>
            ) : null}

            {mode === "register" ? (
              <input
                required
                type="password"
                minLength={8}
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            ) : null}

            {mode === "forgot" && forgotMessage ? null : (
              <Button
                type="submit"
                variant="cta"
                loading={busy}
                loadingLabel="Processing..."
              >
                {mode === "login" ? "Sign in" : mode === "forgot" ? "Send reset link" : "Create account"}
              </Button>
            )}
          </form>
        </article>
      </section>
    </main>
  );
};
