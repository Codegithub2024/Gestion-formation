import type { BaseEntity } from "./base.types";
import type { Utilisateur } from "./utilisateur.types";
import type { Cours } from "./cours.types";

export type FormateurInterne = BaseEntity & {
  utilisateur: Utilisateur;
  coursEnseignables: Cours[];
};

export type FormateurExterne = BaseEntity & {
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  organisme: string;
  coursEnseignables: Cours[];
};
