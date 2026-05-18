// layouts/FormateurLayout.tsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  LogOut,
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
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col bg-white border-r border-neutral-100 p-4">
        <div className="mb-8 px-2">
          <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">
            Espace formateur
          </p>
          <p className="text-sm font-semibold text-neutral-800">
            {user?.prenom} {user?.nom}
          </p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => logoutMutation.mutate()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </aside>

      {/* Contenu */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
