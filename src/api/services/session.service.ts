import type { Session } from "../../types/session.types";
import { apiFetch } from "../base.api";

export const sessionService = {
  getAll: () => apiFetch<Session[]>("/api/admin/sessions"),
};
