export interface DashboardStats {
  // Utilisateurs
  totalUtilisateurs: number;
  totalCandidats: number;
  totalFormateurs: number;

  // Sessions
  totalSessions: number;
  sessionsPlanifiees: number;
  sessionsEnCours: number;
  sessionsTerminees: number;

  // Inscriptions
  totalInscriptions: number;
  tauxPresence: number;

  // Evaluations
  totalEvaluations: number;
  tauxReussite: number;

  // Sondages
  totalSondages: number;
  sondagesOuverts: number;

  // Cours
  totalCours: number;
  coursActifs: number;
}
