import type { Participant } from "../../types/participant.types";
import { apiFetch } from "../base.api";

export const participantService = {
  getAll: () => apiFetch<Participant>("/api/candidat"),
};
