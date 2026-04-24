import type { DashboardStats } from "../../types/dashboard.types";
import { apiFetch } from "../base.api";

export const statsService = {
  getAllStats: () => apiFetch<DashboardStats>("/api/stats/tableau-de-bord"),
};
