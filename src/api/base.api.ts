import { useAuthStore } from "../store/auth.store";

export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().user?.token;

  const res = await fetch(`http://localhost:8086${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur API");
  }

  return res.json();
}
