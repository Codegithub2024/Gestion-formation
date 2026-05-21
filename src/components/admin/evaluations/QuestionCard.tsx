// components/admin/evaluations/QuestionCard.tsx
import type { Question } from "../../../types/evaluation.types";

type Props = {
  question: Question;
  index: number;
  peutModifier: boolean;
  onEditer: () => void;
  onSupprimer: () => void;
  onAjouterChoix: () => void;
  onEditerChoix: (choix: {
    id: number;
    texte: string;
    estCorrect: boolean;
  }) => void;
  onSupprimerChoix: (choixId: number) => void;
};

const TYPE_LABELS: Record<string, string> = {
  QCM: "QCM",
  VRAI_FAUX: "Vrai / Faux",
  REPONSE_LIBRE: "Réponse libre",
};

const TYPE_COLORS: Record<string, string> = {
  QCM: "bg-violet-100 text-violet-700",
  VRAI_FAUX: "bg-amber-100 text-amber-700",
  REPONSE_LIBRE: "bg-blue-100 text-blue-700",
};

export default function QuestionCard({
  question,
  index,
  peutModifier,
  onEditer,
  onSupprimer,
  onAjouterChoix,
  onEditerChoix,
  onSupprimerChoix,
}: Props) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-neutral-100 rounded-xl">
      {/* En-tête question */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="flex-shrink-0 w-7 h-7 bg-neutral-100 rounded-full flex items-center justify-center text-xs font-semibold text-neutral-600">
            {index + 1}
          </span>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-sm font-medium">{question.enonce}</p>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  TYPE_COLORS[question.type]
                }`}
              >
                {TYPE_LABELS[question.type]}
              </span>
              <span className="text-xs text-neutral-400">
                {question.points} pt(s)
              </span>
            </div>
          </div>
        </div>

        {peutModifier && (
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={onEditer}
              className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Modifier
            </button>
            <button
              onClick={onSupprimer}
              className="text-xs px-2.5 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

      {/* Choix de réponse */}
      {(question.type === "QCM" || question.type === "VRAI_FAUX") && (
        <div className="flex flex-col gap-2 ml-10">
          {question.choix?.map((c) => (
            <div
              key={c.id}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                c.estCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-neutral-100 bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    c.estCorrect ? "bg-green-500" : "bg-neutral-300"
                  }`}
                />
                <span className="text-sm">{c.texte}</span>
                {c.estCorrect && (
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Correct
                  </span>
                )}
              </div>
              {peutModifier && (
                <div className="flex gap-1">
                  <button
                    onClick={() => onEditerChoix(c)}
                    className="text-xs text-neutral-400 hover:text-neutral-700 px-2 py-1 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onSupprimerChoix(c.id)}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          ))}

          {peutModifier && (
            <button
              onClick={onAjouterChoix}
              className="text-xs text-neutral-500 hover:text-neutral-800 px-3 py-2 border border-dashed border-neutral-200 rounded-lg hover:border-neutral-400 transition-colors text-left"
            >
              + Ajouter un choix
            </button>
          )}
        </div>
      )}

      {/* Réponse libre */}
      {question.type === "REPONSE_LIBRE" && (
        <div className="ml-10">
          <div className="px-3 py-2 border border-dashed border-neutral-200 rounded-lg">
            <p className="text-xs text-neutral-400 italic">
              Zone de réponse libre — correction manuelle requise
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
