import type { Role } from "../types/enums.types";

export const getRedirectPath = (role: Role): string => {
  const paths: Record<Role, string> = {
    ADMIN: "/admin/dashboard",
    GESTIONNAIRE_FORMATION: "/gestionnaire/dashboard",
    FORMATEUR: "/formateur/dashboard",
    CANDIDAT: "/candidat/dashboard",
  };
  return paths[role];
};
