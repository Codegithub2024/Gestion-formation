import type { BaseEntity } from "./base.types";
import type { Domaine } from "./domaine.types";
import type { TypeDocument } from "./enums.types";

export type Cours = BaseEntity & {
  titre: string;
  description: string | null;
  dureeHeures: number;
  actif: boolean;
  domaine: Domaine;
  prerequis: Cours[]; // relation récursive
  documents: Document[];
};

export type Document = BaseEntity & {
  titre: string;
  reference: string;
  cheminFichier: string | null;
  type: TypeDocument;
  cours: Cours;
};
