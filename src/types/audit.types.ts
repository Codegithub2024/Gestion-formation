import type { BaseEntity } from "./base.types";
import type { Session } from "./session.types";
import type { Utilisateur } from "./utilisateur.types";
import type { TypeActionSession, TypeEvenementSecurite } from "./enums.types";

export type SessionLog = BaseEntity & {
  session: Session | null;
  utilisateur: Utilisateur | null;
  action: TypeActionSession;
  details: string | null;
  dateAction: string;
};

export type SecurityLog = BaseEntity & {
  typeEvenement: TypeEvenementSecurite;
  username: string;
  adresseIp: string;
  details: string | null;
  dateEvenement: string;
  alerteEnvoyee: boolean;
};
