// components/admin/evaluations/ChangerStatutEvaluationForm.tsx
import { useState } from "react";
import type { StatutEvaluation } from "../../../types/enums.types";

type Props = {
  statutActuel: StatutEvaluation;
  onSubmit: (statut: StatutEvaluation) => void;
  isLoading: boolean;
};

const TRANSITIONS: Record<StatutEvaluation, StatutEvaluation[]> = {
  PLANIFIEE: ["EN_COURS", "ANNULEE"],
  EN_COURS: ["TERMINEE", "ANNULEE"],
  TERMINEE: [],
  ANNULEE: [],
};

const LABELS: Record<StatutEvaluation, string> = {
  PLANIFIEE: "Planifiée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

const DESCRIPTIONS: Record<StatutEvaluation, string> = {
  EN_COURS: "Les candidats peuvent maintenant passer l'évaluation",
  TERMINEE: "Plus aucun candidat ne peut soumettre de réponses",
  ANNULEE: "L'évaluation est annulée définitivement",
  PLANIFIEE: "",
};

export default function ChangerStatutEvaluationForm({
  statutActuel,
  onSubmit,
  isLoading,
}: Props) {
  const transitions = TRANSITIONS[statutActuel];
  const [selected, setSelected] = useState<StatutEvaluation | "">(
    transitions[0] ?? "",
  );

  if (transitions.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        Aucun changement possible depuis "{LABELS[statutActuel]}".
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-neutral-500">
        Statut actuel :{" "}
        <span className="font-medium text-neutral-900">
          {LABELS[statutActuel]}
        </span>
      </p>

      <div className="flex flex-col gap-2">
        {transitions.map((statut) => (
          <button
            key={statut}
            onClick={() => setSelected(statut)}
            className={`flex flex-col gap-0.5 px-4 py-3 rounded-xl border text-left transition-all ${
              selected === statut
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  selected === statut ? "bg-neutral-900" : "bg-neutral-200"
                }`}
              />
              <span className="text-sm font-medium">{LABELS[statut]}</span>
            </div>
            {DESCRIPTIONS[statut] && (
              <p className="text-xs text-neutral-400 ml-5">
                {DESCRIPTIONS[statut]}
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => selected && onSubmit(selected)}
          disabled={!selected || isLoading}
          className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Mise à jour..." : "Confirmer"}
        </button>
      </div>
    </div>
  );
}
