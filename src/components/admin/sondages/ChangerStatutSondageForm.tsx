// components/admin/sondages/ChangerStatutSondageForm.tsx
import { useState } from "react";
import type { StatutSondage } from "../../../types/enums.types";

type Props = {
  statutActuel: StatutSondage;
  onSubmit: (statut: StatutSondage) => void;
  isLoading: boolean;
};

// Correspond exactement à l'enum Java StatutSondage
const TRANSITIONS: Record<StatutSondage, StatutSondage[]> = {
  PLANIFIE: ["EN_COURS", "ANNULE"],
  EN_COURS: ["TERMINE", "ANNULE"],
  TERMINE: [],
  ANNULE: [],
};

const LABELS: Record<StatutSondage, string> = {
  PLANIFIE: "Planifié",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
};

const DESCRIPTIONS: Record<StatutSondage, string> = {
  PLANIFIE: "",
  EN_COURS: "Les candidats peuvent maintenant répondre au sondage",
  TERMINE: "Le sondage est clôturé — le rapport est disponible",
  ANNULE: "Le sondage est annulé définitivement",
};

const STATUT_STYLES: Record<StatutSondage, string> = {
  PLANIFIE: "border-blue-200 bg-blue-50",
  EN_COURS: "border-green-200 bg-green-50",
  TERMINE: "border-neutral-200 bg-neutral-50",
  ANNULE: "border-red-200 bg-red-50",
};

export default function ChangerStatutSondageForm({
  statutActuel,
  onSubmit,
  isLoading,
}: Props) {
  const transitions = TRANSITIONS[statutActuel];
  const [selected, setSelected] = useState<StatutSondage | "">(
    transitions[0] ?? "",
  );

  if (transitions.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-neutral-500">
          Statut actuel :{" "}
          <span className="font-medium text-neutral-900">
            {LABELS[statutActuel]}
          </span>
        </p>
        <p className="text-sm text-neutral-400">
          Aucun changement de statut possible depuis cet état.
        </p>
      </div>
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
            className={`flex flex-col gap-0.5 px-4 py-3 rounded-xl border-2 text-left transition-all ${
              selected === statut
                ? STATUT_STYLES[statut]
                : "border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  selected === statut
                    ? statut === "EN_COURS"
                      ? "bg-green-500"
                      : statut === "TERMINE"
                        ? "bg-neutral-500"
                        : "bg-red-500"
                    : "bg-neutral-200"
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

      <div className="flex justify-end mt-2">
        <button
          onClick={() => selected && onSubmit(selected as StatutSondage)}
          disabled={!selected || isLoading}
          className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg disabled:opacity-50 transition-opacity"
        >
          {isLoading ? "Mise à jour..." : "Confirmer"}
        </button>
      </div>
    </div>
  );
}
