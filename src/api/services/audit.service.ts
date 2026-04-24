// services/audit.service.ts
import type { SecurityLog, TypeEvenement } from "../../types/audit.types";
import { apiFetch } from "../base.api";

export const auditService = {
  // Tous les logs
  getLogs: () => apiFetch<SecurityLog[]>("/api/admin/audit/security"),

  // Logs filtrés par type
  getLogsByType: (type: TypeEvenement) =>
    apiFetch<SecurityLog[]>(`/api/admin/audit/security/${type}`),

  // Historique Envers d'une entité
  getHistoriqueEntite: (entite: string, id: number) =>
    apiFetch(`/api/admin/audit/envers/${entite}/${id}`),
};
