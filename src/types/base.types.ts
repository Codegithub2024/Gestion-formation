// Tout ce qui vient de BaseEntity — présent dans chaque réponse
export type BaseEntity = {
  id: number;
  dateCreation: string; // LocalDateTime sérialisé en string ISO par Jackson
  dateModification: string;
  creePar: string | null;
  modifiePar: string | null;
};
