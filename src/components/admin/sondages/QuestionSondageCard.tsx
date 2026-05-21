// components/admin/sondages/QuestionSondageCard.tsx
import { X } from "lucide-react";
import type { QuestionSondage } from "../../../types/sondage.types";

type Props = {
  question: QuestionSondage;
  index: number;
  peutModifier: boolean;
  onEditer: () => void;
  onSupprimer: () => void;
  onAjouterOption: () => void;
  onEditerOption: (option: { id: number; texte: string }) => void;
  onSupprimerOption: (optionId: number) => void;
};

const TYPE_LABELS: Record<string, string> = {
  QCM: "Choix unique",
  VRAI_FAUX: "Vrai / Faux",
  REPONSE_LIBRE: "Réponse libre",
};

const TYPE_COLORS: Record<string, string> = {
  QCM: "bg-violet-100 text-violet-700",
  VRAI_FAUX: "bg-amber-100 text-amber-700",
  REPONSE_LIBRE: "bg-blue-100 text-blue-700",
};

export default function QuestionSondageCard({
  question,
  index,
  peutModifier,
  onEditer,
  onSupprimer,
  onAjouterOption,
  onEditerOption,
  onSupprimerOption,
}: Props) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-black/10 rounded-xl">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="shrink-0 w-7 h-7 bg-neutral-100 rounded-full flex items-center justify-center text-xs font-semibold text-neutral-600">
            {index + 1}
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{question.enonce}</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${
                TYPE_COLORS[question.type]
              }`}
            >
              {TYPE_LABELS[question.type]}
            </span>
          </div>
        </div>

        {peutModifier && (
          <div className="flex gap-1.5 hrink-0">
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

      {/* Options */}
      {(question.type === "QCM" || question.type === "VRAI_FAUX") && (
        <div className="flex flex-col divide-y divide-neutral-200 ml-10 rounded-lg border border-neutral-200 overflow-hidden">
          {question.options?.map((opt) => (
            <div
              key={opt.id}
              className="flex items-center justify-between px-3 py-2 bg-neutral-50"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-300 shrink-0" />
                <span className="text-sm">{opt.texte}</span>
              </div>
              {peutModifier && (
                <div className="flex gap-1">
                  <button
                    onClick={() => onEditerOption(opt)}
                    className="text-xs text-neutral-400 hover:text-neutral-700 px-2 py-1 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onSupprimerOption(opt.id)}
                    className="text-xs text-red-200 hover:text-red-400 p-1 border rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {peutModifier && (
            <div className="flex flex-1 w-full p-1">
              <button
                onClick={onAjouterOption}
                className="text-xs text-neutral-500 flex-1 hover:text-neutral-800 px-3 py-2 border-2 border-dashed border-neutral-200 rounded-lg hover:border-neutral-400 transition-colors text-left"
              >
                + Ajouter une option
              </button>
            </div>
          )}
        </div>
      )}

      {/* Réponse libre */}
      {question.type === "REPONSE_LIBRE" && (
        <div className="ml-10">
          <div className="px-3 py-2 border border-dashed border-neutral-200 rounded-lg">
            <p className="text-xs text-neutral-400 italic">
              Zone de réponse ouverte — les répondants saisiront leur avis
              librement
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
