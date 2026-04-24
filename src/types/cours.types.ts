import type { BaseEntity } from "./base.types";
import type { Domaine } from "./domaine.types";

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
  type: import("./enums.types").TypeDocument;
  cours: Cours;
};

// Pour la création — on envoie des IDs, pas des objets imbriqués
export type CreateCoursDTO = {
  titre: string;
  description?: string;
  dureeHeures: number;
  domaineId: number;
  prerequisIds?: number[];
};

export type UpdateCoursDTO = Partial<CreateCoursDTO>;
