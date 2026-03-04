"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { useAuth } from "@/providers/AuthProvider";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/discover", label: "Discover" },
  { href: "/reservations", label: "Reservations" },
  { href: "/host", label: "Host" }
];

export const AppShell = ({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const { user, logout, updateProfile } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const saveProfile = async (payload: {
    name?: string;
    location?: string;
    password?: string;
  }) => {
    setProfileBusy(true);
    setProfileError(null);
    try {
      await updateProfile(payload);
      setProfileOpen(false);
    } catch (error) {
      setProfileError((error as Error).message);
    } finally {
      setProfileBusy(false);
    }
  };

  return (
    <main className="page shell-page">
      <div className="aurora" aria-hidden="true" />
      <header className="shell-header fade-up">
        <div>
          <p className="eyebrow">LocalSpot Booker</p>
          <h1>{title}</h1>
          <p className="subtitle">{subtitle}</p>
        </div>
        <div className="stack-right">
          <p className="user-pill">{user.name} · {user.location}</p>
          <button className="ghost-btn" onClick={() => setProfileOpen(true)}>
            Profile
          </button>
          <button className="ghost-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <nav className="shell-nav slide-in">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "active-link" : ""}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <section className="shell-content">{children}</section>

      <ProfileModal
        user={user}
        open={profileOpen}
        busy={profileBusy}
        error={profileError}
        onClose={() => setProfileOpen(false)}
        onSave={saveProfile}
      />
    </main>
  );
};
