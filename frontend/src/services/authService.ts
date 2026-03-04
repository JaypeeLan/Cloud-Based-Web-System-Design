import { request } from "@/lib/api";
import type { User } from "@/lib/types";

export const authService = {
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: { email, password },
      token: null
    }),

  register: (name: string, location: string, email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: { name, location, email, password, role: "customer" },
      token: null
    }),

  me: () => request<User>("/auth/me"),

  updateProfile: (payload: { name?: string; location?: string; password?: string }) =>
    request<User>("/auth/profile", {
      method: "PATCH",
      body: payload
    })
};
