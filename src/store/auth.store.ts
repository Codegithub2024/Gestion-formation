import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/user.types";
import type { role } from "../types/role.types";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  setUser: (user: User) => void;
  logout: () => void;
  hasRole: (role: role | role[]) => boolean;
};

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Appelé après un login réussi
      setUser: (user) => set({ user, isAuthenticated: true }),

      // Réinitialise tout le state
      logout: () => set(initialState),

      // Vérifie si l'utilisateur a un rôle précis (ou l'un des rôles)
      hasRole: (role) => {
        const userRole = get().user?.role;
        if (!userRole) return false;
        return Array.isArray(role)
          ? role.includes(userRole)
          : userRole === role;
      },
    }),
    {
      name: "auth", // clé dans localStorage
      storage: createJSONStorage(() => localStorage),
      // On ne persiste pas le mot de passe, même hasché
      partialize: (state) => ({
        user: state.user ? { ...state.user, password: undefined } : null,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
