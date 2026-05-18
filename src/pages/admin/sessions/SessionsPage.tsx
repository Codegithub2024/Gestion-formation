// pages/admin/sessions/SessionsPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDialogStore } from "../../../store/dialog.store";
import { sessionService } from "../../../services/session.service";
import { coursService } from "../../../services/cours.service";
import { formateurService } from "../../../services/formateur.service";
import SessionForm from "../../../components/admin/sessions/SessionForm";
import SessionTable from "../../../components/admin/sessions/SessionTable";
import ConfirmSuppression from "../../../components/ui/ConfirmSuppression";
import type { Session } from "../../../types/session.types";
import type { CreateSessionRequest } from "../../../types/requests.types";
import type { ApiError } from "../../../api/base.api";

export default function SessionsPage() {
  const navigate = useNavigate();
  const { open, close } = useDialogStore();
  const queryClient = useQueryClient();

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionService.getAll,
  });

  const { data: cours = [] } = useQuery({
    queryKey: ["cours"],
    queryFn: coursService.getAll,
  });

  const { data: formateursInternes = [] } = useQuery({
    queryKey: ["formateurs-internes"],
    queryFn: formateurService.getAllInternes,
  });

  const { data: formateursExternes = [] } = useQuery({
    queryKey: ["formateurs-externes"],
    queryFn: formateurService.getAllExternes,
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: CreateSessionRequest) => sessionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session créée");
      close();
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => sessionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session supprimée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCreer = () => {
    open(
      "Nouvelle session",
      <SessionForm
        session={null}
        cours={cours}
        formateursInternes={formateursInternes}
        formateursExternes={formateursExternes}
        onSubmit={(data) => createMutation.mutate(data as CreateSessionRequest)}
        isLoading={createMutation.isPending}
      />,
    );
  };

  const handleSupprimer = (session: Session) => {
    open(
      "Confirmer la suppression",
      <ConfirmSuppression
        message={`Supprimer la session "${session.cours?.titre}" ?`}
        detail="Toutes les inscriptions associées seront supprimées."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(session.id)}
        onAnnuler={close}
      />,
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Sessions</h1>
          <p className="text-sm text-neutral-500">
            {sessions.length} session(s)
          </p>
        </div>
        <button
          onClick={handleCreer}
          className="bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg"
        >
          Nouvelle session
        </button>
      </div>

      <SessionTable
        sessions={sessions}
        isLoading={isLoading}
        onVoir={(id) => navigate(`/admin/sessions/${id}`)}
        onSupprimer={handleSupprimer}
      />
    </div>
  );
}
