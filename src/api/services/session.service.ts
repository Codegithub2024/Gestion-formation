import type {
  CreateSessionDTO,
  UpdateSessionDTO,
} from "../../types/session.types";
import { apiFetch } from "../base.api";
import type { Session } from "react-router-dom";

export const sessionService = {
  getAll: () => apiFetch<Session[]>("/api/admin/sessions"),

  getById: (id: number) => apiFetch<Session>(`/api/admin/sessions/${id}`),

  create: (data: CreateSessionDTO) =>
    apiFetch<Session>("/api/admin/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateSessionDTO) =>
    apiFetch<Session>(`/api/admin/sessions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiFetch<null>(`/api/admin/sessions/${id}`, {
      method: "DELETE",
    }),
};
