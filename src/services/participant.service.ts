import type { User } from "../types/auth.types";
import { apiFetch } from "../api/base.api";

export const participantService = {
  getAll: () => apiFetch<User[]>("/api/candidat"),
};
