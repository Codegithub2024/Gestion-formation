// services/session.service.ts
import { apiFetch } from "../api/base.api";
import type { Session, Inscription } from "../types/session.types";
import type {
  CreateSessionRequest,
  UpdateSessionRequest,
  EnregistrerPresencesRequest,
} from "../types/requests.types";
import type { StatutSession, StatutInscription } from "../types/enums.types";

export const sessionService = {
  // ── Sessions ──────────────────────────────────────────────────────────────
  getAll: () => apiFetch<Session[]>("/api/admin/sessions"),

  getById: (id: number) => apiFetch<Session>(`/api/admin/sessions/${id}`),

  create: (data: CreateSessionRequest) =>
    apiFetch<Session>("/api/admin/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateSessionRequest) =>
    apiFetch<Session>(`/api/admin/sessions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<null>(`/api/admin/sessions/${id}`, {
      method: "DELETE",
    }),

  changerStatut: (id: number, statut: StatutSession) =>
    apiFetch<Session>(`/api/admin/sessions/${id}/statut?statut=${statut}`, {
      method: "PATCH",
    }),

  assignerFormateurInterne: (sessionId: number, formateurId: number) =>
    apiFetch<Session>(
      `/api/admin/sessions/${sessionId}/formateur-interne/${formateurId}`,
      { method: "PATCH" },
    ),

  assignerFormateurExterne: (sessionId: number, formateurId: number) =>
    apiFetch<Session>(
      `/api/admin/sessions/${sessionId}/formateur-externe/${formateurId}`,
      { method: "PATCH" },
    ),

  retirerFormateur: (sessionId: number) =>
    apiFetch<Session>(`/api/admin/sessions/${sessionId}/formateur`, {
      method: "DELETE",
    }),

  // ── Inscriptions ──────────────────────────────────────────────────────────
  getInscriptions: (sessionId: number) =>
    apiFetch<Inscription[]>(`/api/admin/sessions/${sessionId}/inscriptions`),

  confirmerInscription: (inscriptionId: number) =>
    apiFetch<Inscription>(
      `/api/admin/inscriptions/${inscriptionId}/confirmer`,
      {
        method: "PATCH",
      },
    ),

  annulerInscription: (inscriptionId: number) =>
    apiFetch<Inscription>(`/api/admin/inscriptions/${inscriptionId}/annuler`, {
      method: "PATCH",
    }),

  enregistrerPresences: (
    sessionId: number,
    presences: EnregistrerPresencesRequest,
  ) =>
    apiFetch<null>(`/api/admin/sessions/${sessionId}/presences`, {
      method: "PATCH",
      body: JSON.stringify(presences),
    }),
};
