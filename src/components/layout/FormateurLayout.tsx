// layouts/FormateurLayout.tsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  LogOut,
  User,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { formateurProfilService } from "../../services/formateur.profil.service";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../../api/base.api";

const NAV_ITEMS = [
  {
    to: "/formateur/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  { to: "/formateur/sessions", label: "Mes sessions", icon: CalendarDays },
  { to: "/formateur/evaluations", label: "Évaluations", icon: ClipboardList },
];

export default function FormateurLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => apiFetch("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      logout();
      navigate("/login");
    },
  });

  return (
    <>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-40 bg-white border-b border-neutral-100">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            {/* Logo / titre */}
            <span className="text-sm font-semibold text-neutral-800 tracking-tight">
              OKI Formation
            </span>

            {/* Navigation centrale */}
            <nav className="flex items-center rounded-xl overflow-hidden">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `button gap-2 py-3 px-3 rounded ${
                      isActive
                        ? "bg-primary-amber text-primary-amber-text hover:ring-primary-amber-text/50 active:ring-primary-amber-text"
                        : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
                    }`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Profil + déconnexion */}
            <div className="flex rounded-xl ring-1 ring-black/10 divide-x divide-black/10 overflow-hidden">
              <div
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors`}
              >
                <User size={15} />
                <span className="hidden sm:inline">
                  {user?.prenom} {user?.nom}
                </span>
              </div>
              <div
                className="flex-1 hover:text-neutral-600 px-2 hover:bg-neutral-100 transition-colors flex justify-center items-center"
                onClick={() => logoutMutation.mutate()}
              >
                <button
                  className="text-neutral-400 flex-1 h-full transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <main className="flex-1 max-w-4xl mx-auto w-full py-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}
