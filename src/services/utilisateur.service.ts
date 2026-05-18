// services/utilisateur.service.ts
import { apiFetch } from "../api/base.api";
import type { Utilisateur } from "../types/utilisateur.types";
import type {
  UpdateUtilisateurRequest,
  CreateUtilisateurRequest,
} from "../types/requests.types";
import type { Role } from "../types/enums.types";

export const utilisateurService = {
  getAll: () => apiFetch<Utilisateur[]>("/api/admin/utilisateurs"),

  getById: (id: number) =>
    apiFetch<Utilisateur>(`/api/admin/utilisateurs/${id}`),

  create: (data: CreateUtilisateurRequest) =>
    apiFetch<Utilisateur>("/api/admin/utilisateurs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateUtilisateurRequest) =>
    apiFetch<Utilisateur>(`/api/admin/utilisateurs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<null>(`/api/admin/utilisateurs/${id}`, {
      method: "DELETE",
    }),

  changerRole: (id: number, role: Role) =>
    apiFetch<Utilisateur>(`/api/admin/utilisateurs/${id}/role?role=${role}`, {
      method: "PATCH",
    }),
};
