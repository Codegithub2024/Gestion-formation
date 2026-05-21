import { apiFetch } from "../api/base.api";
import type { Utilisateur } from "../types/utilisateur.types";
import type { Inscription } from "../types/session.types";
import type { ResultatEvaluation } from "../types/evaluation.types";

export type CandidatDetail = {
  candidat: Utilisateur;
  inscriptions: Inscription[];
  resultats: ResultatEvaluation[];
};

export const candidatAdminService = {
  getAll: () => apiFetch<Utilisateur[]>("/api/admin/candidats"),

  getDetail: (id: number) =>
    apiFetch<CandidatDetail>(`/api/admin/candidats/${id}`),
};
