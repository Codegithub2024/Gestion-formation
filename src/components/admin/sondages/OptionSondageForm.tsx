// components/admin/sondages/OptionSondageForm.tsx
import { useState } from "react";
import type { CreateOptionSondageRequest } from "../../../types/requests.types";

type Props = {
  option: { id: number; texte: string } | null;
  onSubmit: (data: CreateOptionSondageRequest) => void;
  isLoading: boolean;
};

export default function OptionSondageForm({
  option,
  onSubmit,
  isLoading,
}: Props) {
  const [texte, setTexte] = useState(option?.texte ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!texte.trim()) {
      setError("Le texte de l'option est obligatoire");
      return;
    }
    setError(null);
    onSubmit({ texte });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Texte de l'option
        </label>
        <input
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="Ex: Très satisfait(e)"
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          autoFocus
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end mt-2">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Enregistrement..." : option ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </div>
  );
}
