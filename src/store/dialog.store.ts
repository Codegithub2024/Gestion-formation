import { create } from "zustand";

export type DialogType =
  | "creer-domaine"
  | "modifier-domaine"
  | "creer-utilisateur"
  | "modifier-utilisateur"
  | "creer-cours"
  | "modifier-cours"
  | "confirmer-suppression"
  | null;

type DialogStore = {
  isOpen: boolean;
  titre: string;
  content: React.ReactNode | null;
  open: (titre: string, content: React.ReactNode) => void;
  close: () => void;
};

export const useDialogStore = create<DialogStore>((set) => ({
  isOpen: false,
  titre: "",
  content: null,
  open: (titre, content) => set({ isOpen: true, titre, content }),
  close: () => set({ isOpen: false, titre: "", content: null }),
}));
