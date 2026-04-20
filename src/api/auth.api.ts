import type { User } from "../types/user.types";

export type LoginStatus = {
  success: boolean;
  errorMessage?: string | null;
  data: User | null;
};

export const login = async (
  email: string,
  motDePasse: string,
): Promise<LoginStatus> => {
  try {
    const res = await fetch("http://localhost:8086/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, motDePasse }),
    });

    if (!res.ok) {
      // Tente de lire le message d'erreur renvoyé par le serveur
      const errorBody = await res.json().catch(() => null);
      const errorMessage =
        errorBody?.message ??
        errorBody?.error ??
        "Nom d'utilisateur ou mot de passe incorrect";

      return { success: false, errorMessage, data: null };
    }

    const data = (await res.json()) as User;
    return { success: true, data };
  } catch {
    // Pas de réseau, serveur down, etc.
    return {
      success: false,
      errorMessage:
        "Impossible de joindre le serveur. Vérifiez votre connexion.",
      data: null,
    };
  }
};
