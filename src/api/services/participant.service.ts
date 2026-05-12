import type { User } from "../../types/auth.types";
import { apiFetch } from "../base.api";

export const participantService = {
  getAll: () => apiFetch<User[]>("/api/candidat"),
};
