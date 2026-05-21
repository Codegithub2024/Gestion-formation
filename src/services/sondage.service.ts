import { apiFetch } from "../api/base.api";
import type {
  Sondage,
  QuestionSondage,
  OptionSondage,
  ReponseSondage,
} from "../types/sondage.types";
import type {
  CreateSondageRequest,
  UpdateSondageRequest,
  CreateQuestionSondageRequest,
  UpdateQuestionSondageRequest,
  CreateOptionSondageRequest,
} from "../types/requests.types";
import type { StatutSondage } from "../types/enums.types";

export const sondageService = {
  // ── Sondages ──────────────────────────────────────────────────────────────
  getAll: () => apiFetch<Sondage[]>("/api/admin/sondages"),

  getById: (id: number) => apiFetch<Sondage>(`/api/admin/sondages/${id}`),

  create: (data: CreateSondageRequest) =>
    apiFetch<Sondage>("/api/admin/sondages", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateSondageRequest) =>
    apiFetch<Sondage>(`/api/admin/sondages/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<null>(`/api/admin/sondages/${id}`, {
      method: "DELETE",
    }),

  changerStatut: (id: number, statut: StatutSondage) =>
    apiFetch<Sondage>(`/api/admin/sondages/${id}/statut?statut=${statut}`, {
      method: "PATCH",
    }),

  // ── Questions ─────────────────────────────────────────────────────────────
  ajouterQuestion: (sondageId: number, data: CreateQuestionSondageRequest) =>
    apiFetch<QuestionSondage>(`/api/admin/sondages/${sondageId}/questions`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuestion: (
    sondageId: number,
    questionId: number,
    data: UpdateQuestionSondageRequest,
  ) =>
    apiFetch<QuestionSondage>(
      `/api/admin/sondages/${sondageId}/questions/${questionId}`,
      { method: "PUT", body: JSON.stringify(data) },
    ),

  deleteQuestion: (sondageId: number, questionId: number) =>
    apiFetch<null>(`/api/admin/sondages/${sondageId}/questions/${questionId}`, {
      method: "DELETE",
    }),

  // ── Options ───────────────────────────────────────────────────────────────
  ajouterOption: (
    sondageId: number,
    questionId: number,
    data: CreateOptionSondageRequest,
  ) =>
    apiFetch<OptionSondage>(
      `/api/admin/sondages/${sondageId}/questions/${questionId}/options`,
      { method: "POST", body: JSON.stringify(data) },
    ),

  updateOption: (
    sondageId: number,
    questionId: number,
    optionId: number,
    data: CreateOptionSondageRequest,
  ) =>
    apiFetch<OptionSondage>(
      `/api/admin/sondages/${sondageId}/questions/${questionId}/options/${optionId}`,
      { method: "PUT", body: JSON.stringify(data) },
    ),

  deleteOption: (sondageId: number, questionId: number, optionId: number) =>
    apiFetch<null>(
      `/api/admin/sondages/${sondageId}/questions/${questionId}/options/${optionId}`,
      { method: "DELETE" },
    ),

  // ── Réponses et rapport ───────────────────────────────────────────────────
  getReponses: (sondageId: number) =>
    apiFetch<ReponseSondage[]>(`/api/admin/sondages/${sondageId}/reponses`),

  getRapport: (sondageId: number) =>
    apiFetch<RapportSondage>(`/api/admin/sondages/${sondageId}/rapport`),
};

// Type du rapport retourné par le backend
export type RapportSondage = {
  sondage: string;
  totalRepondants: number;
  questions: {
    question: string;
    resultats?: Record<string, number>;
    reponsesLibres?: string[];
  }[];
};
