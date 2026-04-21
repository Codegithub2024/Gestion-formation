import { useAuthStore } from "../store/auth.store";

export class ApiError extends Error {
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().user?.token;

  const res = await fetch(`http://localhost:8086${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Token expiré ou invalide → déconnexion automatique
  if (res.status === 401) {
    useAuthStore.getState().logout();
    throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.");
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = errorBody?.message ?? `Erreur ${res.status}`;
    throw new ApiError(res.status, message);
  }

  // 204 No Content → pas de body à parser
  if (res.status === 204) return null as T;

  return res.json() as Promise<T>;
}
