import type { Domaine } from "../types/domaine.types";
import type {
  CreateDomaineRequest,
  UpdateDomaineRequest,
} from "../types/requests.types";
import { apiFetch } from "../api/base.api";

export const domaineService = {
  getAll: () => apiFetch<Domaine[]>("/api/admin/domaines"),

  getById: (id: number) => apiFetch<Domaine>(`/api/admin/domaines/${id}`),

  create: (data: CreateDomaineRequest) =>
    apiFetch<Domaine>("/api/admin/domaines", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateDomaineRequest) =>
    apiFetch<Domaine>(`/api/admin/domaines/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<null>(`/api/admin/domaines/${id}`, {
      method: "DELETE",
    }),
};
