// components/admin/sessions/ChangerStatutForm.tsx
import { useState } from "react";
import type { StatutSession } from "../../../types/enums.types";

type Props = {
  statutActuel: StatutSession;
  onSubmit: (statut: StatutSession) => void;
  isLoading: boolean;
};

// Transitions valides selon le backend
const TRANSITIONS: Record<StatutSession, StatutSession[]> = {
  PLANIFIEE: ["EN_COURS", "ANNULEE"],
  EN_COURS: ["TERMINEE", "ANNULEE"],
  TERMINEE: [],
  ANNULEE: [],
};

const LABELS: Record<StatutSession, string> = {
  PLANIFIEE: "Planifiée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

export default function ChangerStatutForm({
  statutActuel,
  onSubmit,
  isLoading,
}: Props) {
  const transitions = TRANSITIONS[statutActuel];
  const [selected, setSelected] = useState<StatutSession | "">(
    transitions[0] ?? "",
  );

  if (transitions.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        Aucun changement de statut possible depuis "{LABELS[statutActuel]}".
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
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
              selected === statut
                ? "border-neutral-900 bg-neutral-50"
                : "border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full ${
                selected === statut ? "bg-neutral-900" : "bg-neutral-200"
              }`}
            />
            <span className="text-sm font-medium">{LABELS[statut]}</span>
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
