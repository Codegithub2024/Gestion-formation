import type { FormateurInterne } from "../../types/formateur.types";
import type { User } from "../../types/auth.types";
import { apiFetch } from "../base.api";

export const formateurService = {
  getAll: () =>
    apiFetch<FormateurInterne[]>("/api/admin/formateur/interne/all"),

  getById: (id: number) =>
    apiFetch<FormateurInterne>(`/api/admin/formateur/interne/${id}`),

  addToUser: (data: User) =>
    apiFetch("/api/admin/formateurs", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  create: (id: number) =>
    apiFetch("/api/admin/formateurs/asign", {
      method: "POST",
      body: JSON.stringify(id),
    }),

  update: (id: number, data: FormateurInterne) =>
    apiFetch<FormateurInterne>(`/api/admin/formateurs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<null>(`/api/admin/formateurs/${id}`, {
      method: "DELETE",
    }),
};
