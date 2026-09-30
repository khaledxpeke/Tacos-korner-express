export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api";

const TOKEN_KEY = "loyaltyToken";

export const loyaltyRoutes = {
  home: "/fidelite",
  login: "/fidelite/login",
  signup: "/fidelite/signup",
  points: "/fidelite/points",
  link: (session: string) => `/fidelite/link?session=${encodeURIComponent(session)}`,
};

export type LoyaltyAccount = {
  userId: string;
  fullName: string;
  phone: string;
  code: string;
  balance: number;
};

export type LedgerEntry = {
  id: string;
  type: "earn" | "redeem";
  points: number;
  balanceAfter: number;
  historyId: string;
  restaurantId: string;
  createdAt?: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loyaltyApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  headers.set("X-Requested-With", "XMLHttpRequest");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "omit",
  });
  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Une erreur est survenue.");
  }
  return data as T;
}
