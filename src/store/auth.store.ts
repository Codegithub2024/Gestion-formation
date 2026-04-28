import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/auth.types";
import type { Role } from "../types/enums.types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  hasRole: (role: Role | Role[]) => boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      // Appelé par le refresh — on ne touche pas au refreshToken ni au user
      setAccessToken: (accessToken) => set({ accessToken }),

      logout: () => set(initialState),

      hasRole: (role) => {
        const userRole = get().user?.role;
        if (!userRole) return false;
        return Array.isArray(role)
          ? role.includes(userRole)
          : userRole === role;
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken, // persisté pour survivre au refresh de page
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
