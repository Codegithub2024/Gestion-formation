import { createBrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import DashboardPage from "../pages/admin/DashboardPage";
import UtilisateursPage from "../pages/admin/utilisateur/UtilisateursPage";
import FormateursPage from "../pages/admin/formateurs/FormateursPage";
import CoursPage from "../pages/admin/cours/CoursPage";
import DomainesPage from "../pages/admin/domaines/DomainesPage";
import SessionsPage from "../pages/admin/sessions/SessionsPage";
import EvalutationsPage from "../pages/admin/evaluations/EvalutationsPage";
import SondagesPage from "../pages/admin/sondages/SondagesPage";
import AuditPage from "../pages/admin/securite/AuditPage";
import AdminLayout from "../components/layout/AdminLayout";
import SessionsFormPage from "../pages/admin/sessions/SessionsFormPage";
import SessionsEditPage from "../pages/admin/sessions/SessionsEditPage";
import LoginPage from "../pages/auth/LoginPage";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasRole } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRole(["ADMIN", "GESTIONNAIRE_FORMATION"])) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    handle: { crumb: () => "Administration" },
    children: [
      {
        path: "unauthorized",
        element: <div>Unauthorized</div>,
        handle: { crumb: () => "Unauthorized" },
      },
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
        handle: { crumb: () => "Dashboard" },
      },
      {
        path: "utilisateurs",
        element: <UtilisateursPage />,
        handle: { crumb: () => "Utilisateurs" },
      },
      {
        path: "formateurs",
        element: <FormateursPage />,
        handle: { crumb: () => "Formateurs" },
      },
      {
        path: "cours",
        element: <CoursPage />,
        handle: { crumb: () => "Cours" },
      },
      {
        path: "domaines",
        element: <DomainesPage />,
        handle: { crumb: () => "Domaines" },
      },
      {
        path: "sessions",
        element: <SessionsPage />,
        handle: { crumb: () => "Sessions" },
      },
      {
        path: "sessions/new",
        element: <SessionsFormPage />,
        handle: { crumb: () => "Nouvelle session" },
      },
      {
        path: "sessions/:id/edit",
        element: <SessionsEditPage />,
        handle: { crumb: () => "Modifier session" },
      },
      {
        path: "evaluations",
        element: <EvalutationsPage />,
        handle: { crumb: () => "Evaluations" },
      },
      {
        path: "sondages",
        element: <SondagesPage />,
        handle: { crumb: () => "Sondages" },
      },
      {
        path: "audit",
        element: <AuditPage />,
        handle: { crumb: () => "Audit" },
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    handle: { crumb: () => "Connexion" },
  },
]);
