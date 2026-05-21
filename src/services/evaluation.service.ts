// services/evaluation.service.ts
import { apiFetch } from "../api/base.api";
import type {
  Evaluation,
  Question,
  ChoixReponse,
  ResultatEvaluation,
} from "../types/evaluation.types";
import type {
  CreateEvaluationRequest,
  UpdateEvaluationRequest,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CreateChoixReponseRequest,
} from "../types/requests.types";
import type { StatutEvaluation } from "../types/enums.types";

export const evaluationService = {
  // ── Evaluations ───────────────────────────────────────────────────────────
  getAll: () => apiFetch<Evaluation[]>("/api/admin/evaluations"),

  getById: (id: number) => apiFetch<Evaluation>(`/api/admin/evaluations/${id}`),

  create: (data: CreateEvaluationRequest) =>
    apiFetch<Evaluation>("/api/admin/evaluations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateEvaluationRequest) =>
    apiFetch<Evaluation>(`/api/admin/evaluations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<null>(`/api/admin/evaluations/${id}`, {
      method: "DELETE",
    }),

  changerStatut: (id: number, statut: StatutEvaluation) =>
    apiFetch<Evaluation>(
      `/api/admin/evaluations/${id}/statut?statut=${statut}`,
      { method: "PATCH" },
    ),

  // ── Questions ─────────────────────────────────────────────────────────────
  getQuestions: (evalId: number) =>
    apiFetch<Question[]>(`/api/admin/evaluations/${evalId}/questions`),

  ajouterQuestion: (evalId: number, data: CreateQuestionRequest) =>
    apiFetch<Question>(`/api/admin/evaluations/${evalId}/questions`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuestion: (
    evalId: number,
    questionId: number,
    data: UpdateQuestionRequest,
  ) =>
    apiFetch<Question>(
      `/api/admin/evaluations/${evalId}/questions/${questionId}`,
      { method: "PUT", body: JSON.stringify(data) },
    ),

  deleteQuestion: (evalId: number, questionId: number) =>
    apiFetch<null>(`/api/admin/evaluations/${evalId}/questions/${questionId}`, {
      method: "DELETE",
    }),

  // ── Choix de réponse ──────────────────────────────────────────────────────
  ajouterChoix: (
    evalId: number,
    questionId: number,
    data: CreateChoixReponseRequest,
  ) =>
    apiFetch<ChoixReponse>(
      `/api/admin/evaluations/${evalId}/questions/${questionId}/choix`,
      { method: "POST", body: JSON.stringify(data) },
    ),

  updateChoix: (
    evalId: number,
    questionId: number,
    choixId: number,
    data: CreateChoixReponseRequest,
  ) =>
    apiFetch<ChoixReponse>(
      `/api/admin/evaluations/${evalId}/questions/${questionId}/choix/${choixId}`,
      { method: "PUT", body: JSON.stringify(data) },
    ),

  deleteChoix: (evalId: number, questionId: number, choixId: number) =>
    apiFetch<null>(
      `/api/admin/evaluations/${evalId}/questions/${questionId}/choix/${choixId}`,
      { method: "DELETE" },
    ),

  // ── Résultats ─────────────────────────────────────────────────────────────
  getResultats: (evalId: number) =>
    apiFetch<ResultatEvaluation[]>(
      `/api/admin/evaluations/${evalId}/resultats`,
    ),

  getResultatById: (evalId: number, resultatId: number) =>
    apiFetch<ResultatEvaluation>(
      `/api/admin/evaluations/${evalId}/resultats/${resultatId}`,
    ),
};
