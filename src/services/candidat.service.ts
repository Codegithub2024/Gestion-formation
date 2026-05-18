import { apiFetch } from "../api/base.api";
import type { Session, Inscription, Convocation } from "../types/session.types";
import type { Evaluation, ResultatEvaluation } from "../types/evaluation.types";
import type { Sondage } from "../types/sondage.types";
import type { Utilisateur } from "../types/utilisateur.types";
import type {
  SoumissionEvaluationRequest,
  SoumissionSondageRequest,
  UpdateProfilRequest,
} from "../types/requests.types";

export const candidatService = {
  // ── Profil ────────────────────────────────────────────────────────────────
  getProfil: () => apiFetch<Utilisateur>("/api/candidat/profil"),

  updateProfil: (data: UpdateProfilRequest) =>
    apiFetch<Utilisateur>("/api/candidat/profil", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // ── Sessions ──────────────────────────────────────────────────────────────
  getSessionsDisponibles: () => apiFetch<Session[]>("/api/candidat/sessions"),

  getMesInscriptions: () =>
    apiFetch<Inscription[]>("/api/candidat/inscriptions"),

  getMesConvocations: () =>
    apiFetch<Convocation[]>("/api/candidat/inscriptions/convocations"),

  sInscrire: (sessionId: number) =>
    apiFetch<Inscription>(`/api/candidat/sessions/${sessionId}/inscription`, {
      method: "POST",
    }),

  seDesinscrire: (sessionId: number) =>
    apiFetch<null>(`/api/candidat/sessions/${sessionId}/inscription`, {
      method: "DELETE",
    }),

  // ── Evaluations ───────────────────────────────────────────────────────────
  getEvaluations: () => apiFetch<Evaluation[]>("/api/candidat/evaluations"),

  getEvaluationById: (id: number) =>
    apiFetch<Evaluation>(`/api/candidat/evaluations/${id}`),

  getMesResultats: () =>
    apiFetch<ResultatEvaluation[]>("/api/candidat/resultats"),

  getMonResultat: (evalId: number) =>
    apiFetch<ResultatEvaluation>(
      `/api/candidat/evaluations/${evalId}/resultat`,
    ),

  soumettre: (evalId: number, data: SoumissionEvaluationRequest) =>
    apiFetch<ResultatEvaluation>(
      `/api/candidat/evaluations/${evalId}/soumettre`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),

  // ── Sondages ──────────────────────────────────────────────────────────────
  getSondages: () => apiFetch<Sondage[]>("/api/candidat/sondages"),

  repondreSondage: (sondageId: number, data: SoumissionSondageRequest) =>
    apiFetch<null>(`/api/candidat/sondages/${sondageId}/repondre`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
