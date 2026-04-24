import type { BaseEntity } from "./base.types";
import type { Domaine } from "./domaine.types";
import type { Session } from "./session.types";
import type { Utilisateur } from "./utilisateur.types";
import type { StatutEvaluation, TypeQuestion } from "./enums.types";

export type ChoixReponse = BaseEntity & {
  texte: string;
  estCorrect: boolean;
};

export type Question = BaseEntity & {
  enonce: string;
  type: TypeQuestion;
  points: number;
  ordre: number;
  choix: ChoixReponse[];
};

export type Evaluation = BaseEntity & {
  titre: string;
  description: string | null;
  domaine: Domaine;
  session: Session | null;
  dateDebut: string;
  dateFin: string;
  dureeMinutes: number;
  noteMaximale: number;
  seuilReussite: number;
  statut: StatutEvaluation;
  questions: Question[];
};

export type ReponseCandidat = BaseEntity & {
  question: Question;
  choixSelectionne: ChoixReponse | null; // null si réponse libre
  reponseLibre: string | null;
  pointsObtenus: number;
};

export type ResultatEvaluation = BaseEntity & {
  evaluation: Evaluation;
  utilisateur: Utilisateur;
  noteObtenue: number;
  reussi: boolean;
  dateSoumission: string;
  reponses: ReponseCandidat[];
};
