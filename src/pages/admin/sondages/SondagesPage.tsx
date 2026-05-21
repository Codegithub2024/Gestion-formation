import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDialogStore } from "../../../store/dialog.store";
import { sondageService } from "../../../services/sondage.service";
import { domaineService } from "../../../services/domaine.service";
import SondageForm from "../../../components/admin/sondages/SondageForm";
import ConfirmSuppression from "../../../components/ui/ConfirmSuppression";
import type { Sondage } from "../../../types/sondage.types";
import type { CreateSondageRequest } from "../../../types/requests.types";
import Button from "../../../components/ui/Button";
import { Plus } from "lucide-react";

const STATUT_STYLES: Record<string, string> = {
  PLANIFIE: "bg-blue-100 text-blue-700",
  EN_COURS: "bg-green-100 text-green-700",
  TERMINE: "bg-neutral-100 text-neutral-600",
  ANNULE: "bg-red-100 text-red-600",
};

const STATUT_LABELS: Record<string, string> = {
  PLANIFIE: "Planifié",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
};

export default function SondagesPage() {
  const navigate = useNavigate();
  const { open, close } = useDialogStore();
  const queryClient = useQueryClient();

  const { data: sondages = [], isLoading } = useQuery({
    queryKey: ["sondages"],
    queryFn: sondageService.getAll,
  });

  const { data: domaines = [] } = useQuery({
    queryKey: ["domaines"],
    queryFn: domaineService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSondageRequest) => sondageService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sondages"] });
      toast.success("Sondage créé");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => sondageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sondages"] });
      toast.success("Sondage supprimé");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleCreer = () => {
    open(
      "Nouveau sondage",
      <SondageForm
        sondage={null}
        domaines={domaines}
        onSubmit={(data) => createMutation.mutate(data as CreateSondageRequest)}
        isLoading={createMutation.isPending}
      />,
    );
  };

  const handleSupprimer = (sondage: Sondage) => {
    open(
      "Confirmer la suppression",
      <ConfirmSuppression
        message={`Supprimer le sondage "${sondage.titre}" ?`}
        detail="Toutes les questions, options et réponses seront supprimées."
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(sondage.id)}
        onAnnuler={close}
      />,
    );
  };

  const comptes = {
    total: sondages.length,
    PLANIFIE: sondages.filter((s) => s.statut === "PLANIFIE").length,
    EN_COURS: sondages.filter((s) => s.statut === "EN_COURS").length,
    TERMINE: sondages.filter((s) => s.statut === "TERMINE").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Sondages</h1>
          <div className="flex gap-4 text-xs text-neutral-500">
            <span>{comptes.total} au total</span>
            <span className="text-blue-600">
              {comptes.PLANIFIE} planifié(s)
            </span>
            <span className="text-green-600">{comptes.EN_COURS} en cours</span>
            <span>{comptes.TERMINE} terminé(s)</span>
          </div>
        </div>
        <Button
          onClick={handleCreer}
          text="Nouveau sondage"
          buttonStyle="amber"
        >
          <Plus size={16} strokeWidth={3} />
        </Button>
      </div>

      {/* Liste */}
      {isLoading ? (
        <p className="text-sm text-neutral-500">Chargement...</p>
      ) : sondages.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-sm">Aucun sondage créé.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-2 rounded-2xl">
          {sondages.map((s) => (
            <div
              onClick={() => navigate(`/admin/sondages/${s.id}`)}
              key={s.id}
              className="flex items-center justify-between hover:ring-1 hover:ring-black/20 transition-all duration-150 rounded-lg bg-white border border-black/10 hover:border-neutral-200 cursor-pointer"
            >
              <div className="flex flex-col p-4 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold truncate">{s.titre}</p>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0 ${
                      STATUT_STYLES[s.statut]
                    }`}
                  >
                    {STATUT_LABELS[s.statut]}
                  </span>
                  {s.anonyme && (
                    <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full shrink-0">
                      🔒 Anonyme
                    </span>
                  )}
                </div>
                <div className="flex gap-2 text-xs text-neutral-400">
                  <span>{s.domaine?.nom}</span> |
                  <span>
                    {new Date(s.dateDebut).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(s.dateFin).toLocaleDateString("fr-FR")}
                  </span>
                  |<span>{s.questions?.length ?? 0} question(s)</span>
                </div>
              </div>

              <div className="flex gap-2 ml-4 shrink-0 p-4">
                <button
                  onClick={() => handleSupprimer(s)}
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
