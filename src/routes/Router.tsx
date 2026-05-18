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
import LoginPage from "../pages/auth/LoginPage";
import AuthLayout from "../components/layout/AuthLayout";
import SessionDetailPage from "../pages/admin/sessions/SessionDetailPage";
import FormateurLayout from "../components/layout/FormateurLayout";
import FormateurDashboardPage from "../pages/formateur/FormateurDashboardPage";
import FormateurSessionDetailPage from "../pages/formateur/FormateurSessionDetailPage";
import FormateurEvaluationsPage from "../pages/formateur/FormateurEvaluationsPage";
import FormateurEvaluationDetailPage from "../pages/formateur/FormateurEvaluationDetailPage";
import FormateurSessionsPage from "../pages/formateur/FormateurSessionsPage";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasRole } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRole(["ADMIN", "GESTIONNAIRE_FORMATION"])) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
}

function FormateurGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasRole } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRole("FORMATEUR")) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

function CandidatGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasRole } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRole("CANDIDAT")) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

<Routes>
  <Route element={<CandidatLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<CandidatDashboardPage />} />
    <Route path="sessions" element={<CandidatSessionsPage />} />
    <Route path="evaluations" element={<CandidatEvaluationsPage />} />
    <Route
      path="evaluations/:id/passer"
      element={<CandidatEvaluationPasserPage />}
    />
    <Route path="sondages" element={<CandidatSondagesPage />} />
    <Route path="profil" element={<CandidatProfilPage />} />
  </Route>
</Routes>;

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
        handle: { crumb: () => "Sessions" },
        children: [
          {
            index: true,
            element: <SessionsPage />,
          },
          {
            path: ":id",
            element: <SessionDetailPage />,
            handle: { crumb: () => "Detail session" },
          },
        ],
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
    path: "/formateur",
    element: (
      <FormateurGuard>
        <FormateurLayout />
      </FormateurGuard>
    ),
    handle: { crumb: () => "Formateur" },
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <FormateurDashboardPage />,
        handle: { crumb: () => "Dashboard" },
      },
      {
        path: "sessions",
        element: <FormateurSessionsPage />,
        handle: { crumb: () => "Sessions" },
      },
      {
        path: "sessions/:id",
        element: <FormateurSessionDetailPage />,
      },
      {
        path: "evaluations",
        element: <FormateurEvaluationsPage />,
        handle: { crumb: () => "Evaluations" },
      },
      {
        path: "evaluations/:id",
        element: <FormateurEvaluationDetailPage />,
        handle: { crumb: () => "Detail evaluation" },
      },
    ],
  },
  {
    path: "/candidat",
    element: (
      <CandidatGuard>
        <CandidatLayout />
      </CandidatGuard>
    ),
  },
  {
    path: "/login",
    element: <AuthLayout />,
    handle: { crumb: () => "Connexion" },
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
]);
