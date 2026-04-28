import { Navigate, Route, Routes } from "react-router-dom";
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

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasRole } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasRole(["ADMIN", "GESTIONNAIRE_FORMATION"])) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
}

export default function AdminRoutes() {
  return (
    <AdminGuard>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route element={<AdminRoutes />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="utilisateurs" element={<UtilisateursPage />} />
          {/* <Route path="utilisateurs/:id" element={<UtilisateurDetailPage />} /> */}

          <Route path="formateurs" element={<FormateursPage />} />

          <Route path="cours" element={<CoursPage />} />
          {/* <Route path="cours/:id" element={<CoursDetailPage />} /> */}

          <Route path="domaines" element={<DomainesPage />} />

          <Route path="sessions" element={<SessionsPage />} />
          {/* <Route path="sessions/:id" element={<SessionDetailPage />} /> */}

          <Route path="evaluations" element={<EvalutationsPage />} />
          {/* <Route path="evaluations/:id" element={<EvaluationDetailPage />} /> */}

          <Route path="sondages" element={<SondagesPage />} />
          {/* <Route path="sondages/:id" element={<SondageDetailPage />} /> */}

          <Route path="audit" element={<AuditPage />} />
        </Route>
      </Routes>
    </AdminGuard>
  );
}
