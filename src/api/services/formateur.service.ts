// services/formateur.service.ts
import { apiFetch } from "../base.api";
import type {
  FormateurInterne,
  FormateurExterne,
} from "../../types/formateur.types";
import type {
  CreateFormateurExterneRequest,
  UpdateFormateurExterneRequest,
} from "../../types/requests.types";

export const formateurService = {
  // ── Internes ──────────────────────────────────────────────────────────────
  getAllInternes: () =>
    apiFetch<FormateurInterne[]>("/api/admin/formateurs/internes"),

  getInterneById: (id: number) =>
    apiFetch<FormateurInterne>(`/api/admin/formateurs/internes/${id}`),

  createInterne: (utilisateurId: number) =>
    apiFetch<FormateurInterne>(
      `/api/admin/formateurs/internes?utilisateurId=${utilisateurId}`,
      { method: "POST" },
    ),

  deleteInterne: (id: number) =>
    apiFetch<null>(`/api/admin/formateurs/internes/${id}`, {
      method: "DELETE",
    }),

  assignerCoursInterne: (formateurId: number, coursId: number) =>
    apiFetch<FormateurInterne>(
      `/api/admin/formateurs/internes/${formateurId}/cours/${coursId}`,
      { method: "POST" },
    ),

  retirerCoursInterne: (formateurId: number, coursId: number) =>
    apiFetch<FormateurInterne>(
      `/api/admin/formateurs/internes/${formateurId}/cours/${coursId}`,
      { method: "DELETE" },
    ),

  // ── Externes ──────────────────────────────────────────────────────────────
  getAllExternes: () =>
    apiFetch<FormateurExterne[]>("/api/admin/formateurs/externes"),

  getExterneById: (id: number) =>
    apiFetch<FormateurExterne>(`/api/admin/formateurs/externes/${id}`),

  createExterne: (data: CreateFormateurExterneRequest) =>
    apiFetch<FormateurExterne>("/api/admin/formateurs/externes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateExterne: (id: number, data: UpdateFormateurExterneRequest) =>
    apiFetch<FormateurExterne>(`/api/admin/formateurs/externes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteExterne: (id: number) =>
    apiFetch<null>(`/api/admin/formateurs/externes/${id}`, {
      method: "DELETE",
    }),

  assignerCoursExterne: (formateurId: number, coursId: number) =>
    apiFetch<FormateurExterne>(
      `/api/admin/formateurs/externes/${formateurId}/cours/${coursId}`,
      { method: "POST" },
    ),

  retirerCoursExterne: (formateurId: number, coursId: number) =>
    apiFetch<FormateurExterne>(
      `/api/admin/formateurs/externes/${formateurId}/cours/${coursId}`,
      { method: "DELETE" },
    ),
};
