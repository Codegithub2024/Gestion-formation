import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth.store";
import { apiFetch } from "../../api/base.api";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  BarChart2,
  User,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/candidat/dashboard", label: "Accueil", icon: LayoutDashboard },
  { to: "/candidat/sessions", label: "Sessions", icon: CalendarDays },
  { to: "/candidat/evaluations", label: "Évaluations", icon: ClipboardList },
  { to: "/candidat/sondages", label: "Sondages", icon: BarChart2 },
];

export default function CandidatLayout() {
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
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo / titre */}
          <span className="text-sm font-semibold text-neutral-800 tracking-tight">
            OKI Formation
          </span>

          {/* Navigation centrale */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100"
                  }`
                }
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Profil + déconnexion */}
          <div className="flex items-center gap-2">
            <NavLink
              to="/candidat/profil"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-500 hover:bg-neutral-100"
                }`
              }
            >
              <User size={15} />
              <span className="hidden sm:inline">{user?.prenom}</span>
            </NavLink>
            <button
              onClick={() => logoutMutation.mutate()}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
