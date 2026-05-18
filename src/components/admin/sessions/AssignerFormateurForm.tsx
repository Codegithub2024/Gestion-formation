// components/admin/sessions/AssignerFormateurForm.tsx
import { useState } from "react";
import type {
  FormateurInterne,
  FormateurExterne,
} from "../../../types/formateur.types";

type Props = {
  formateursInternes: FormateurInterne[];
  formateursExternes: FormateurExterne[];
  onAssignerInterne: (id: number) => void;
  onAssignerExterne: (id: number) => void;
  isLoading: boolean;
};

export default function AssignerFormateurForm({
  formateursInternes,
  formateursExternes,
  onAssignerInterne,
  onAssignerExterne,
  isLoading,
}: Props) {
  const [type, setType] = useState<"interne" | "externe">("interne");
  const [selectedId, setSelectedId] = useState<number | "">("");

  const handleAssigner = () => {
    if (selectedId === "") return;
    if (type === "interne") onAssignerInterne(Number(selectedId));
    else onAssignerExterne(Number(selectedId));
  };

  const liste = type === "interne" ? formateursInternes : formateursExternes;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(["interne", "externe"] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setType(t);
              setSelectedId("");
            }}
            className={`px-3 py-1.5 text-xs rounded-lg border capitalize transition-colors ${
              type === t
                ? "bg-neutral-900 text-white border-neutral-900"
                : "border-neutral-200 text-neutral-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <select
        value={selectedId}
        onChange={(e) => setSelectedId(Number(e.target.value))}
        className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
      >
        <option value="">Sélectionner un formateur...</option>
        {liste.length === 0 && (
          <option disabled>Aucun formateur compatible avec ce cours</option>
        )}
        {type === "interne"
          ? formateursInternes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.utilisateur.prenom} {f.utilisateur.nom}
              </option>
            ))
          : formateursExternes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.prenom} {f.nom} — {f.organisme}
              </option>
            ))}
      </select>

      <div className="flex justify-end">
        <button
          onClick={handleAssigner}
          disabled={selectedId === "" || isLoading}
          className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Assignation..." : "Assigner"}
        </button>
      </div>
    </div>
  );
}
