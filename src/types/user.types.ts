import type { role } from "./role.types";

export type User = {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: role;
  token?: string;
};
