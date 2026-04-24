import type { BaseEntity } from "./base.types";

export type Domaine = BaseEntity & {
  nom: string;
  description: string | null;
};
