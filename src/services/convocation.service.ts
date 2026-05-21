import { apiFetch } from "../api/base.api";
import type { Convocation } from "../types/session.types";

export const convocationService = {
  getBySession: (sessionId: number) =>
    apiFetch<Convocation[]>(`/api/admin/sessions/${sessionId}/convocations`),

  envoyerCandidats: (sessionId: number) =>
    apiFetch<Convocation[]>(
      `/api/admin/sessions/${sessionId}/convocations/candidats`,
      { method: "POST" },
    ),

  envoyerFormateur: (sessionId: number) =>
    apiFetch<Convocation[]>(
      `/api/admin/sessions/${sessionId}/convocations/formateur`,
      { method: "POST" },
    ),
};
