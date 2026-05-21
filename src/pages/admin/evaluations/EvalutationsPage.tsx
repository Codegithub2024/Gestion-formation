// pages/admin/evaluations/EvaluationsPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDialogStore } from "../../../store/dialog.store";
import { evaluationService } from "../../../services/evaluation.service";
import { domaineService } from "../../../services/domaine.service";
import { sessionService } from "../../../services/session.service";
import EvaluationForm from "../../../components/admin/evaluations/EvaluationForm";
import ConfirmSuppression from "../../../components/ui/ConfirmSuppression";
import type { Evaluation } from "../../../types/evaluation.types";
import type { CreateEvaluationRequest } from "../../../types/requests.types";
import Button from "../../../components/ui/Button";

const STATUT_STYLES: Record<string, string> = {
  PLANIFIEE: "bg-blue-100 text-blue-700",
  EN_COURS: "bg-green-100 text-green-700",
  TERMINEE: "bg-neutral-100 text-neutral-600",
  ANNULEE: "bg-red-100 text-red-600",
};

const STATUT_LABELS: Record<string, string> = {
  PLANIFIEE: "Planifiée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

export default function EvaluationsPage() {
  const navigate = useNavigate();
  const { open, close } = useDialogStore();
  const queryClient = useQueryClient();

  const { data: evaluations = [], isLoading } = useQuery({
    queryKey: ["evaluations"],
    queryFn: evaluationService.getAll,
  });

  const { data: domaines = [] } = useQuery({
    queryKey: ["domaines"],
    queryFn: domaineService.getAll,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateEvaluationRequest) =>
      evaluationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      toast.success("Évaluation créée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => evaluationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      toast.success("Évaluation supprimée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCreer = () => {
    open(
      "Nouvelle évaluation",
      <EvaluationForm
        evaluation={null}
        domaines={domaines}
        sessions={sessions}
        onSubmit={(data) =>
          createMutation.mutate(data as CreateEvaluationRequest)
        }
        isLoading={createMutation.isPending}
      />,
    );
  };

  const handleSupprimer = (evaluation: Evaluation) => {
    open(
      "Confirmer la suppression",
      <ConfirmSuppression
        message={`Supprimer l'évaluation "${evaluation.titre}" ?`}
        detail="Toutes les questions et résultats associés seront supprimés."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(evaluation.id)}
        onAnnuler={close}
      />,
    );
  };

  // Compteurs par statut
  const comptes = {
    total: evaluations.length,
    PLANIFIEE: evaluations.filter((e) => e.statut === "PLANIFIEE").length,
    EN_COURS: evaluations.filter((e) => e.statut === "EN_COURS").length,
    TERMINEE: evaluations.filter((e) => e.statut === "TERMINEE").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Évaluations</h1>
          <div className="flex gap-4 text-xs text-neutral-500">
            <span>{comptes.total} au total</span>
            <span className="text-blue-600">
              {comptes.PLANIFIEE} planifiée(s)
            </span>
            <span className="text-green-600">{comptes.EN_COURS} en cours</span>
            <span>{comptes.TERMINEE} terminée(s)</span>
          </div>
        </div>
        <Button
          onClick={handleCreer}
          text="Nouvelle évaluation"
          add
          buttonStyle="black"
        />
      </div>

      {/* Liste */}
      {isLoading ? (
        <p className="text-sm text-neutral-500">Chargement...</p>
      ) : evaluations.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-sm">Aucune évaluation créée.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {evaluations.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-xl hover:border-neutral-200 transition-colors"
            >
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium truncate">{e.titre}</p>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      STATUT_STYLES[e.statut]
                    }`}
                  >
                    {STATUT_LABELS[e.statut]}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-neutral-400">
                  <span>{e.domaine?.nom}</span>
                  <span>
                    {new Date(e.dateDebut).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(e.dateFin).toLocaleDateString("fr-FR")}
                  </span>
                  <span>{e.dureeMinutes} min</span>
                  <span>Note max : {e.noteMaximale}</span>
                  <span>{e.questions?.length ?? 0} question(s)</span>
                </div>
              </div>

              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button
                  onClick={() => navigate(`/admin/evaluations/${e.id}`)}
                  className="text-xs px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Gérer
                </button>
                <button
                  onClick={() => handleSupprimer(e)}
                  className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
