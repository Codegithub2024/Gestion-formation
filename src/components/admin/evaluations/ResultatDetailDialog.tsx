// components/admin/evaluations/ResultatDetailDialog.tsx
import type {
  ResultatEvaluation,
  Evaluation,
} from "../../../types/evaluation.types";

type Props = {
  resultat: ResultatEvaluation;
  evaluation: Evaluation;
};

export default function ResultatDetailDialog({ resultat, evaluation }: Props) {
  return (
    <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
      {/* Résumé */}
      <div
        className={`flex items-center justify-between p-4 rounded-xl ${
          resultat.reussi ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <div>
          <p className="text-sm font-semibold">
            {resultat.utilisateur.prenom} {resultat.utilisateur.nom}
          </p>
          <p className="text-xs text-neutral-500">
            Soumis le{" "}
            {new Date(resultat.dateSoumission).toLocaleString("fr-FR")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">
            {resultat.noteObtenue}
            <span className="text-sm font-normal text-neutral-400">
              {" "}
              / {evaluation.noteMaximale}
            </span>
          </p>
          <span
            className={`text-xs font-medium ${
              resultat.reussi ? "text-green-600" : "text-red-500"
            }`}
          >
            {resultat.reussi ? "✓ Réussi" : "✗ Échoué"}
          </span>
        </div>
      </div>

      {/* Détail par question */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-neutral-700">
          Détail des réponses
        </p>

        {evaluation.questions
          ?.sort((a, b) => a.ordre - b.ordre)
          .map((question, index) => {
            const reponse = resultat.reponses?.find(
              (r) => r.question?.id === question.id,
            );

            return (
              <div
                key={question.id}
                className="flex flex-col gap-2 p-3 bg-neutral-50 rounded-xl"
              >
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm">
                    <span className="text-neutral-400 mr-1.5">
                      {index + 1}.
                    </span>
                    {question.enonce}
                  </p>
                  <span className="text-xs text-neutral-400 flex-shrink-0">
                    {reponse?.pointsObtenus ?? 0} / {question.points} pt(s)
                  </span>
                </div>

                {question.type === "REPONSE_LIBRE" ? (
                  <div className="px-3 py-2 bg-white border border-neutral-200 rounded-lg">
                    <p className="text-xs text-neutral-500 mb-1">
                      Réponse du candidat :
                    </p>
                    <p className="text-sm">
                      {reponse?.reponseLibre || (
                        <span className="text-neutral-400 italic">
                          Pas de réponse
                        </span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {question.choix?.map((c) => {
                      const estSelectionne =
                        reponse?.choixSelectionne?.id === c.id;
                      return (
                        <div
                          key={c.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                            estSelectionne && c.estCorrect
                              ? "bg-green-100 text-green-700"
                              : estSelectionne && !c.estCorrect
                                ? "bg-red-100 text-red-600"
                                : c.estCorrect
                                  ? "bg-green-50 text-green-600"
                                  : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          <span>{estSelectionne ? "●" : "○"}</span>
                          <span>{c.texte}</span>
                          {c.estCorrect && (
                            <span className="ml-auto font-medium">✓</span>
                          )}
                          {estSelectionne && !c.estCorrect && (
                            <span className="ml-auto font-medium">✗</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
