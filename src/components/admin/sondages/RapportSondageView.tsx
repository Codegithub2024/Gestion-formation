// components/admin/sondages/RapportSondageView.tsx
import type { RapportSondage } from "../../../services/sondage.service";
import type { Sondage } from "../../../types/sondage.types";

type Props = {
  rapport: RapportSondage | null;
  isLoading: boolean;
  sondage: Sondage;
};

export default function RapportSondageView({
  rapport,
  isLoading,
  sondage,
}: Props) {
  if (isLoading)
    return <p className="text-sm text-neutral-500">Chargement du rapport...</p>;

  if (!rapport || rapport.totalRepondants === 0) {
    return (
      <div className="text-center py-16 text-neutral-400">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-sm">
          {sondage.statut === "PLANIFIE"
            ? "Le sondage n'est pas encore ouvert."
            : "Aucune réponse pour ce sondage."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Résumé global */}
      <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
        <div className="flex flex-col">
          <p className="text-2xl font-bold">{rapport.totalRepondants}</p>
          <p className="text-xs text-neutral-500">
            {sondage.anonyme ? "réponse(s) anonyme(s)" : "répondant(s)"}
          </p>
        </div>
        <div className="w-px h-10 bg-neutral-200" />
        <div className="flex flex-col">
          <p className="text-sm font-medium">{rapport.questions.length}</p>
          <p className="text-xs text-neutral-500">question(s)</p>
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-6">
        {rapport.questions.map((q, index) => (
          <div key={index} className="flex flex-col gap-3">
            <p className="text-sm font-medium">
              <span className="text-neutral-400 mr-2">{index + 1}.</span>
              {q.question}
            </p>

            {/* Réponses avec options — barres de progression */}
            {q.resultats && (
              <div className="flex flex-col gap-2">
                {Object.entries(q.resultats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([option, count]) => {
                    const pourcentage =
                      rapport.totalRepondants > 0
                        ? Math.round((count / rapport.totalRepondants) * 100)
                        : 0;
                    return (
                      <div key={option} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-700">{option}</span>
                          <span className="text-neutral-500">
                            {count} réponse(s) — {pourcentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neutral-900 rounded-full transition-all"
                            style={{ width: `${pourcentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Réponses libres */}
            {q.reponsesLibres && q.reponsesLibres.length > 0 && (
              <div className="flex flex-col gap-2">
                {q.reponsesLibres.map((reponse, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl"
                  >
                    <p className="text-sm text-neutral-700">{reponse}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
