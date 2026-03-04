"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "@/lib/storage";
import type { User } from "@/lib/types";
import { authService } from "@/services/authService";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, location: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  updateProfile: (payload: {
    name?: string;
    location?: string;
    password?: string;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const token = storage.getToken();
    if (!token) {
      setUser(null);
      return;
    }

    const me = await authService.me();
    setUser(me);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await refresh();
      } catch {
        storage.clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    storage.setToken(response.token);
    setUser(response.user);
  };

  const register = async (name: string, location: string, email: string, password: string) => {
    const response = await authService.register(name, location, email, password);
    storage.setToken(response.token);
    setUser(response.user);
  };

  const updateProfile = async (payload: {
    name?: string;
    location?: string;
    password?: string;
  }) => {
    const updatedUser = await authService.updateProfile(payload);
    setUser(updatedUser);
  };

  const logout = () => {
    storage.clearToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh, updateProfile }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
