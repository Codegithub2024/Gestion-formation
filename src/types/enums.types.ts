export type Role =
  | "ADMIN"
  | "GESTIONNAIRE_FORMATION"
  | "FORMATEUR"
  | "CANDIDAT";

export type StatutSession = "PLANIFIEE" | "EN_COURS" | "TERMINEE" | "ANNULEE";

export type StatutInscription =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "ANNULEE"
  | "LISTE_ATTENTE";

export type StatutConvocation = "ENVOYEE" | "RECUE" | "REFUSEE";

export type StatutEvaluation =
  | "PLANIFIEE"
  | "EN_COURS"
  | "TERMINEE"
  | "ANNULEE";

export type StatutSondage = "PLANIFIE" | "EN_COURS" | "TERMINE" | "ANNULE";

export type TypeDocument =
  | "SUPPORT_COURS"
  | "EXERCICE"
  | "ANNEXE"
  | "EVALUATION";

export type TypeQuestion = "QCM" | "VRAI_FAUX" | "REPONSE_LIBRE";

export type TypeActionSession =
  | "INSCRIPTION"
  | "DESINSCRIPTION"
  | "CONFIRMATION_PRESENCE"
  | "ABSENCE"
  | "SOUMISSION_EVALUATION"
  | "CONVOCATION_ENVOYEE"
  | "FORMATEUR_ASSIGNE";

export type TypeEvenementSecurite =
  | "LOGIN_SUCCES"
  | "LOGIN_ECHEC"
  | "ACCES_REFUSE"
  | "TOKEN_EXPIRE"
  | "MODIFICATION_ENTITE"
  | "SUPPRESSION_ENTITE";
