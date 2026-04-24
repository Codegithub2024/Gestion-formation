import type { Role } from "./enums.types";

// Ce que /api/auth/login retourne
export type AuthResponse = {
  token: string;
  role: Role;
  email: string;
  nom: string;
  prenom: string;
};

// Ce que /api/auth/login attend
export type AuthRequest = {
  email: string;
  motDePasse: string;
};

// Ce qu'on stocke dans le store Zustand
export type User = {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  token?: string;
};
