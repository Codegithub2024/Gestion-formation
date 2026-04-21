// src/types/formation.types.ts

export type Session = {
  id: number;
  lieu: string;
  capacite: number;
  statut: string;
  duree: number;
  coursId: number;
  formateurId: number;
  evaluations: number[];
};

export type CreateSessionDTO = Omit<Session, "id">;
export type UpdateSessionDTO = Partial<CreateSessionDTO>;
