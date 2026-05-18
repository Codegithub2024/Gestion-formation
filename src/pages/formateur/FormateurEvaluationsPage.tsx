// pages/formateur/FormateurEvaluationsPage.tsx
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { formateurProfilService } from "../../services/formateur.profil.service";

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

export default function FormateurEvaluationsPage() {
  const navigate = useNavigate();

  const { data: evaluations = [], isLoading } = useQuery({
    queryKey: ["formateur-evaluations"],
    queryFn: formateurProfilService.getEvaluations,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Évaluations</h1>
        <p className="text-sm text-neutral-500">
          {evaluations.length} évaluation(s) liée(s) à vos sessions
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Chargement...</p>
      ) : evaluations.length === 0 ? (
        <p className="text-sm text-neutral-500">Aucune évaluation.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {evaluations.map((e) => (
            <div
              key={e.id}
              onClick={() => navigate(`/formateur/evaluations/${e.id}`)}
              className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-xl cursor-pointer hover:border-neutral-300 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium">{e.titre}</p>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
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
                  <span>Note max : {e.noteMaximale}</span>
                  <span>Seuil : {e.seuilReussite}</span>
                </div>
              </div>
              <span className="text-neutral-400 text-sm">→</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
