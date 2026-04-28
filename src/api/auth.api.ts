import type { User } from "../types/auth.types";
import type { Role } from "../types/enums.types";

// api/auth.api.ts
export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  role: Role;
  email: string;
  nom: string;
  prenom: string;
};

export type LoginStatus = {
  success: boolean;
  errorMessage?: string | null;
  data: LoginResponse | null;
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
      const errorBody = await res.json().catch(() => null);
      return {
        success: false,
        errorMessage: errorBody?.error ?? "Email ou mot de passe incorrect",
        data: null,
      };
    }
    return { success: true, data: await res.json() };
  } catch {
    return {
      success: false,
      errorMessage: "Impossible de joindre le serveur",
      data: null,
    };
  }
};
