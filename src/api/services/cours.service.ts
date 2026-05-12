import type {
  Cours,
  CreateCoursDTO,
  UpdateCoursDTO,
} from "../../types/cours.types";
import { apiFetch } from "../base.api";

export const coursService = {
  getAll: () => apiFetch<Cours[]>("/api/admin/cours"),

  getById: (id: number) => apiFetch<Cours>(`/api/admin/cours/${id}`),

  create: (data: CreateCoursDTO) =>
    apiFetch<Cours>("/api/admin/cours", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateCoursDTO) =>
    apiFetch<Cours>(`/api/admin/cours/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<null>(`/api/admin/cours/${id}`, { method: "DELETE" }),
};
