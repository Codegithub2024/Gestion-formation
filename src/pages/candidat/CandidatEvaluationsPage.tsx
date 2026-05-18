import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { candidatService } from "../../services/candidat.service";

export default function CandidatEvaluationsPage() {
  const navigate = useNavigate();

  const { data: evaluations = [], isLoading: loadingEvals } = useQuery({
    queryKey: ["candidat-evaluations"],
    queryFn: candidatService.getEvaluations,
  });

  const { data: resultats = [], isLoading: loadingResultats } = useQuery({
    queryKey: ["candidat-resultats"],
    queryFn: candidatService.getMesResultats,
  });

  const evalsDejaPasses = new Set(resultats.map((r) => r.evaluation?.id));

  const evalsAFaire = evaluations.filter((e) => !evalsDejaPasses.has(e.id));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold">Évaluations</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Passez vos évaluations et consultez vos résultats
        </p>
      </div>

      {/* Évaluations disponibles */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
          Disponibles ({evalsAFaire.length})
        </h2>

        {loadingEvals ? (
          <p className="text-sm text-neutral-500">Chargement...</p>
        ) : evalsAFaire.length === 0 ? (
          <div className="text-center py-8 text-neutral-400">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-sm">
              Toutes les évaluations disponibles ont été complétées.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {evalsAFaire.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between p-5 bg-blue-50 border border-blue-100 rounded-2xl"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">{e.titre}</p>
                  <div className="flex gap-3 text-xs text-neutral-500">
                    <span>{e.domaine?.nom}</span>
                    <span>⏱ {e.dureeMinutes} min</span>
                    <span>📊 {e.noteMaximale} pts max</span>
                    <span>✅ Seuil : {e.seuilReussite} pts</span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Jusqu'au {new Date(e.dateFin).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigate(`/candidat/evaluations/${e.id}/passer`)
                  }
                  className="text-sm px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-700 transition-colors whitespace-nowrap ml-4"
                >
                  Commencer
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mes résultats */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
          Mes résultats ({resultats.length})
        </h2>

        {loadingResultats ? (
          <p className="text-sm text-neutral-500">Chargement...</p>
        ) : resultats.length === 0 ? (
          <p className="text-sm text-neutral-400">
            Aucun résultat pour le moment.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {resultats
              .sort(
                (a, b) =>
                  new Date(b.dateSoumission).getTime() -
                  new Date(a.dateSoumission).getTime(),
              )
              .map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border ${
                    r.reussi
                      ? "bg-green-50 border-green-100"
                      : "bg-red-50 border-red-100"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{r.evaluation?.titre}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(r.dateSoumission).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">
                      {r.noteObtenue}
                      <span className="text-neutral-400 font-normal">
                        {" "}
                        / {r.evaluation?.noteMaximale}
                      </span>
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        r.reussi
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {r.reussi ? "Réussi" : "Échoué"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
