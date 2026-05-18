// pages/formateur/FormateurEvaluationDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formateurProfilService } from "../../services/formateur.profil.service";

export default function FormateurEvaluationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const evalId = Number(id);
  const navigate = useNavigate();

  const { data: evaluation, isLoading: loadingEval } = useQuery({
    queryKey: ["formateur-evaluation", evalId],
    queryFn: () => formateurProfilService.getEvaluationById(evalId),
  });

  const { data: resultats = [], isLoading: loadingResultats } = useQuery({
    queryKey: ["formateur-evaluation-resultats", evalId],
    queryFn: () => formateurProfilService.getResultats(evalId),
    enabled: !!evaluation,
  });

  if (loadingEval)
    return <p className="p-6 text-sm text-neutral-500">Chargement...</p>;
  if (!evaluation)
    return <p className="p-6 text-sm text-red-500">Évaluation introuvable</p>;

  const nbReussis = resultats.filter((r) => r.reussi).length;
  const moyenneNote =
    resultats.length > 0
      ? resultats.reduce((acc, r) => acc + r.noteObtenue, 0) / resultats.length
      : null;

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Retour */}
      <button
        onClick={() => navigate("/formateur/evaluations")}
        className="text-sm text-neutral-500 hover:text-neutral-900 w-fit transition-colors"
      >
        ← Retour aux évaluations
      </button>

      {/* En-tête */}
      <div>
        <h1 className="text-xl font-semibold">{evaluation.titre}</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {evaluation.domaine?.nom} ·{" "}
          {new Date(evaluation.dateDebut).toLocaleDateString("fr-FR")} →{" "}
          {new Date(evaluation.dateFin).toLocaleDateString("fr-FR")}
        </p>
      </div>

      {/* Infos évaluation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Note maximale", value: `${evaluation.noteMaximale} pts` },
          {
            label: "Seuil de réussite",
            value: `${evaluation.seuilReussite} pts`,
          },
          { label: "Durée", value: `${evaluation.dureeMinutes} min` },
          {
            label: "Questions",
            value: `${evaluation.questions?.length ?? 0}`,
          },
        ].map((info) => (
          <div
            key={info.label}
            className="flex flex-col gap-1 p-3 bg-neutral-50 rounded-xl"
          >
            <p className="text-xs text-neutral-500">{info.label}</p>
            <p className="text-sm font-medium">{info.value}</p>
          </div>
        ))}
      </div>

      {/* Statistiques des résultats */}
      {resultats.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-50 rounded-xl text-center">
            <p className="text-2xl font-bold">{resultats.length}</p>
            <p className="text-xs text-neutral-500 mt-1">
              Candidats ayant passé
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-green-600">{nbReussis}</p>
            <p className="text-xs text-neutral-500 mt-1">
              Réussis ({Math.round((nbReussis / resultats.length) * 100)}%)
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <p className="text-2xl font-bold text-blue-600">
              {moyenneNote?.toFixed(1) ?? "—"}
            </p>
            <p className="text-xs text-neutral-500 mt-1">Moyenne</p>
          </div>
        </div>
      )}

      {/* Résultats des candidats */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">
          Résultats des candidats ({resultats.length})
        </h2>

        {loadingResultats ? (
          <p className="text-sm text-neutral-500">Chargement...</p>
        ) : resultats.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Aucun candidat n'a encore passé cette évaluation.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-neutral-500">
                <th className="pb-3 font-medium">Candidat</th>
                <th className="pb-3 font-medium">Note</th>
                <th className="pb-3 font-medium">Résultat</th>
                <th className="pb-3 font-medium">Date de soumission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {resultats
                .sort((a, b) => b.noteObtenue - a.noteObtenue)
                .map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 font-medium">
                      {r.utilisateur.prenom} {r.utilisateur.nom}
                    </td>
                    <td className="py-3">
                      <span className="font-semibold">{r.noteObtenue}</span>
                      <span className="text-neutral-400">
                        {" "}
                        / {evaluation.noteMaximale}
                      </span>
                    </td>
                    <td className="py-3">
                      {r.reussi ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                          Réussi
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-medium">
                          Échoué
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-neutral-500">
                      {new Date(r.dateSoumission).toLocaleString("fr-FR")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
