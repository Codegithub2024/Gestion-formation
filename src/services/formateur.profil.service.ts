import { apiFetch } from "../api/base.api";
import type { FormateurInterne } from "../types/formateur.types";
import type { Session, Inscription } from "../types/session.types";
import type { Evaluation, ResultatEvaluation } from "../types/evaluation.types";
import type { Cours } from "../types/cours.types";
import type { EnregistrerPresencesRequest } from "../types/requests.types";

export const formateurProfilService = {
  // ── Profil ────────────────────────────────────────────────────────────────
  getProfil: () => apiFetch<FormateurInterne>("/api/formateur/profil"),

  // ── Sessions ──────────────────────────────────────────────────────────────
  getSessions: () => apiFetch<Session[]>("/api/formateur/sessions"),

  getSessionById: (id: number) =>
    apiFetch<Session>(`/api/formateur/sessions/${id}`),

  getInscrits: (sessionId: number) =>
    apiFetch<Inscription[]>(`/api/formateur/sessions/${sessionId}/inscrits`),

  getPresences: (sessionId: number) =>
    apiFetch<Inscription[]>(`/api/formateur/sessions/${sessionId}/presences`),

  enregistrerPresences: (
    sessionId: number,
    presences: EnregistrerPresencesRequest,
  ) =>
    apiFetch<null>(`/api/formateur/sessions/${sessionId}/presences`, {
      method: "PATCH",
      body: JSON.stringify(presences),
    }),

  // ── Cours ─────────────────────────────────────────────────────────────────
  getMesCours: () => apiFetch<Cours[]>("/api/formateur/cours"),

  // ── Evaluations ───────────────────────────────────────────────────────────
  getEvaluations: () => apiFetch<Evaluation[]>("/api/formateur/evaluations"),

  getEvaluationById: (id: number) =>
    apiFetch<Evaluation>(`/api/formateur/evaluations/${id}`),

  getResultats: (evalId: number) =>
    apiFetch<ResultatEvaluation[]>(
      `/api/formateur/evaluations/${evalId}/resultats`,
    ),
};
