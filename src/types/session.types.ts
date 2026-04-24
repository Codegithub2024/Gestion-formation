import type { BaseEntity } from "./base.types";
import type { Cours } from "./cours.types";
import type { FormateurInterne, FormateurExterne } from "./formateur.types";
import type { StatutSession } from "./enums.types";

export type Session = BaseEntity & {
  cours: Cours;
  formateurInterne: FormateurInterne | null;
  formateurExterne: FormateurExterne | null;
  dateDebut: string;
  dateFin: string;
  lieu: string | null;
  capaciteMax: number;
  statut: StatutSession;
  inscriptions: Inscription[];
};

export type CreateSessionDTO = {
  coursId: number;
  formateurInterneId?: number;
  formateurExterneId?: number;
  dateDebut: string;
  dateFin: string;
  lieu?: string;
  capaciteMax: number;
};

// ── Inscription ──────────────────────────────────────────────────────────────

import type { Utilisateur } from "./utilisateur.types";
import type { StatutInscription } from "./enums.types";

export type Inscription = BaseEntity & {
  session: Session;
  utilisateur: Utilisateur;
  dateInscription: string;
  statut: StatutInscription;
  present: boolean | null;
  convocation: Convocation | null;
};

// ── Convocation ──────────────────────────────────────────────────────────────

import type { StatutConvocation } from "./enums.types";

export type Convocation = BaseEntity & {
  session: Session;
  inscription: Inscription | null; // null si convocation formateur
  formateurInterne: FormateurInterne | null;
  formateurExterne: FormateurExterne | null;
  dateEnvoi: string;
  statut: StatutConvocation;
  contenu: string | null;
};
