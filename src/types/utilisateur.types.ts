import type { BaseEntity } from "./base.types";
import type { Role } from "./enums.types";

export type Utilisateur = BaseEntity & {
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  // motDePasse jamais exposé côté frontend
};
