import type { BaseEntity } from "./base.types";
import type { Domaine } from "./domaine.types";
import type { Utilisateur } from "./utilisateur.types";
import type { StatutSondage, TypeQuestion } from "./enums.types";

export type OptionSondage = BaseEntity & {
  texte: string;
};

export type QuestionSondage = BaseEntity & {
  enonce: string;
  type: TypeQuestion;
  ordre: number;
  options: OptionSondage[];
};

export type Sondage = BaseEntity & {
  titre: string;
  description: string | null;
  domaine: Domaine;
  dateDebut: string;
  dateFin: string;
  statut: StatutSondage;
  anonyme: boolean;
  questions: QuestionSondage[];
};

export type ReponseSondage = BaseEntity & {
  sondage: Sondage;
  question: QuestionSondage;
  utilisateur: Utilisateur | null; // null si sondage anonyme
  optionChoisie: OptionSondage | null;
  reponseLibre: string | null;
};
