// components/admin/sessions/PresencesForm.tsx
import { useState } from "react";
import type { Inscription } from "../../../types/session.types";
import type { EnregistrerPresencesRequest } from "../../../types/requests.types";

type Props = {
  inscriptions: Inscription[];
  onSubmit: (presences: EnregistrerPresencesRequest) => void;
  isLoading: boolean;
};

export default function PresencesForm({
  inscriptions,
  onSubmit,
  isLoading,
}: Props) {
  // Initialise avec la valeur déjà enregistrée si elle existe
  const [presences, setPresences] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(inscriptions.map((i) => [i.id, i.present ?? true])),
  );

  const toggle = (id: number) => {
    setPresences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tousPresents = () =>
    setPresences(Object.fromEntries(inscriptions.map((i) => [i.id, true])));

  const tousAbsents = () =>
    setPresences(Object.fromEntries(inscriptions.map((i) => [i.id, false])));

  if (inscriptions.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        Aucun inscrit confirmé pour cette session.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          onClick={tousPresents}
          className="text-xs px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Tous présents
        </button>
        <button
          onClick={tousAbsents}
          className="text-xs px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Tous absents
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {inscriptions.map((i) => (
          <div
            key={i.id}
            onClick={() => toggle(i.id)}
            className="flex items-center justify-between px-4 py-3 border border-neutral-100 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors"
          >
            <span className="text-sm">
              {i.utilisateur.prenom} {i.utilisateur.nom}
            </span>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                presences[i.id]
                  ? "bg-green-500 border-green-500"
                  : "border-neutral-300"
              }`}
            >
              {presences[i.id] && <span className="text-white text-xs">✓</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
        <p className="text-xs text-neutral-500">
          {Object.values(presences).filter(Boolean).length} présent(s) sur{" "}
          {inscriptions.length}
        </p>
        <button
          onClick={() => onSubmit(presences)}
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
