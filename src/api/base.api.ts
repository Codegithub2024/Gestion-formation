// api/base.api.ts
import { useAuthStore } from "../store/auth.store";

export class ApiError extends Error {
  constructor(
    // @ts-ignore
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Évite plusieurs refresh simultanés
let refreshPromise: Promise<string> | null = null;

async function getNewAccessToken(): Promise<string> {
  // Si un refresh est déjà en cours, on attend le même
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) throw new ApiError(401, "Pas de refresh token");

    const res = await fetch("http://localhost:8086/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      // Refresh token expiré → logout complet
      useAuthStore.getState().logout();
      throw new ApiError(401, "Session expirée — reconnectez-vous");
    }
    const data = await res.json();
    useAuthStore.getState().setAccessToken(data.accessToken);
    return data.accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const makeRequest = async (token: string | null) => {
    return fetch(`http://localhost:8086${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  };

  let token = useAuthStore.getState().accessToken;
  let res = await makeRequest(token);

  // Access token expiré → on tente le refresh une fois
  if (res.status === 401) {
    try {
      token = await getNewAccessToken();
      res = await makeRequest(token); // rejoue la requête avec le nouveau token
    } catch {
      throw new ApiError(401, "Session expirée — reconnectez-vous");
    }
  }

  if (res.status === 403) throw new ApiError(403, "Accès refusé");
  if (res.status === 404) throw new ApiError(404, "Ressource introuvable");
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body?.error ?? `Erreur ${res.status}`);
  }

  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}
