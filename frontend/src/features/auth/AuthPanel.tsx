"use client";

import { FormEvent, useState } from "react";

type AuthMode = "login" | "register";

type Props = {
  busy: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, location: string, email: string, password: string) => Promise<void>;
};

export const AuthPanel = ({ busy, onLogin, onRegister }: Props) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === "login") {
      await onLogin(email, password);
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
          <div className="auth-tabs">
            <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
              Login
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

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

            <input
              required
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              required
              type="password"
              minLength={8}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="submit" className="cta-btn" disabled={busy}>
              {busy ? "Processing..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
};
