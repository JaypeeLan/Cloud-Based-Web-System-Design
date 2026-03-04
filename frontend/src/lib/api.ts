import { API_BASE_URL } from "./config";
import { storage } from "./storage";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const token = options.token ?? storage.getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store"
  });

  const payload = (await response.json()) as {
    status: "success" | "error";
    message: string;
    data?: T;
  };

  if (!response.ok || payload.status === "error") {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data as T;
};
