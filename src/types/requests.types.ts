// types/requests.types.ts
import type {
  Role,
  StatutSession,
  TypeDocument,
  TypeQuestion,
} from "./enums.types";

// ── Auth ──────────────────────────────────────────────────────────────────────

export type LoginRequest = {
  email: string;
  motDePasse: string;
};

export type RegisterRequest = {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

// ── Utilisateur ───────────────────────────────────────────────────────────────

export type CreateUtilisateurRequest = {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: Role;
};

export type UpdateUtilisateurRequest = {
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  role: Role;
};

export type UpdateProfilRequest = {
  nom: string;
  prenom: string;
  motDePasse?: string;
};

// ── Domaine ───────────────────────────────────────────────────────────────────

export type CreateDomaineRequest = {
  nom: string;
  description?: string;
};

export type UpdateDomaineRequest = CreateDomaineRequest;

// ── Cours ─────────────────────────────────────────────────────────────────────

export type CreateCoursRequest = {
  titre: string;
  description?: string;
  dureeHeures: number;
  domaineId: number;
  prerequisIds?: number[];
  documentsId?: number[];
};

export type UpdateCoursRequest = {
  titre: string;
  description?: string;
  dureeHeures: number;
  domaineId?: number; // optionnel — pas changé si absent
  prerequisIds?: number[];
  documentsId?: number[];
};

// ── Document ──────────────────────────────────────────────────────────────────

export type CreateDocumentRequest = {
  titre: string;
  reference: string;
  cheminFichier?: string;
  type: TypeDocument;
};

export type UpdateDocumentRequest = CreateDocumentRequest;

// ── Session ───────────────────────────────────────────────────────────────────

export type CreateSessionRequest = {
  coursId: number;
  formateurInterneId?: number; // optionnel — peut être assigné après
  formateurExterneId?: number; // optionnel — mutuellement exclusif avec interne
  dateDebut: string; // ISO 8601 : "2024-03-15T09:00:00"
  dateFin: string;
  lieu?: string;
  capaciteMax: number;
};

export type UpdateSessionRequest = {
  dateDebut: string;
  dateFin: string;
  lieu?: string;
  capaciteMax: number;
  // coursId non modifiable après création — métier
};

export type ChangerStatutSessionRequest = {
  statut: StatutSession;
};

// ── Inscription ───────────────────────────────────────────────────────────────

// Map<inscriptionId, present> — envoyé comme objet JSON
export type EnregistrerPresencesRequest = Record<number, boolean>;

// ── Formateur externe ─────────────────────────────────────────────────────────

export type CreateFormateurExterneRequest = {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  organisme: string;
};

export type UpdateFormateurExterneRequest = CreateFormateurExterneRequest;

// ── Evaluation ────────────────────────────────────────────────────────────────

export type CreateEvaluationRequest = {
  titre: string;
  description?: string;
  domaineId: number;
  sessionId?: number; // optionnel — peut ne pas être liée à une session
  dateDebut: string;
  dateFin: string;
  dureeMinutes: number;
  noteMaximale: number;
  seuilReussite: number;
};

export type UpdateEvaluationRequest = {
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  dureeMinutes: number;
  noteMaximale: number;
  seuilReussite: number;
};

export type CreateQuestionRequest = {
  enonce: string;
  type: TypeQuestion;
  points: number;
  ordre?: number; // optionnel — calculé automatiquement côté backend
};

export type UpdateQuestionRequest = CreateQuestionRequest;

export type CreateChoixReponseRequest = {
  texte: string;
  estCorrect: boolean;
};

export type UpdateChoixReponseRequest = CreateChoixReponseRequest;

// Soumission d'une évaluation par un candidat
export type SoumissionEvaluationRequest = {
  reponsesQcm: Record<number, number>; // questionId → choixId
  reponsesLibres: Record<number, string>; // questionId → texte
};

// ── Sondage ───────────────────────────────────────────────────────────────────

export type CreateSondageRequest = {
  titre: string;
  description?: string;
  domaineId: number;
  dateDebut: string;
  dateFin: string;
  anonyme: boolean;
};

export type UpdateSondageRequest = {
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  anonyme: boolean;
};

export type CreateQuestionSondageRequest = {
  enonce: string;
  type: TypeQuestion;
  ordre?: number;
};

export type UpdateQuestionSondageRequest = CreateQuestionSondageRequest;

export type CreateOptionSondageRequest = {
  texte: string;
};

export type UpdateOptionSondageRequest = CreateOptionSondageRequest;

// Soumission d'un sondage par un candidat
export type ReponseSondageRequest = {
  questionId: number;
  optionId?: number; // null si réponse libre
  reponseLibre?: string; // null si QCM
};

export type SoumissionSondageRequest = ReponseSondageRequest[];
