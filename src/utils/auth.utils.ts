import type { role } from "../types/role.types";

// Juste au-dessus du composant, ou dans un fichier utils/auth.utils.ts
export const getRedirectPath = (role: role): string => {
  const paths: Record<role, string> = {
    ADMIN: "/admin/dashboard",
    GESTIONNAIRE_FORMATION: "/gestionnaire/dashboard",
    FORMATEUR: "/formateur/dashboard",
    CANDIDAT: "/candidat/dashboard",
  };
  return paths[role];
};
