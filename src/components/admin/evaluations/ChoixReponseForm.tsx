// components/admin/evaluations/ChoixReponseForm.tsx
import { useState } from "react";
import type { CreateChoixReponseRequest } from "../../../types/requests.types";

type Props = {
  choix: { id: number; texte: string; estCorrect: boolean } | null;
  onSubmit: (data: CreateChoixReponseRequest) => void;
  isLoading: boolean;
};

export default function ChoixReponseForm({
  choix,
  onSubmit,
  isLoading,
}: Props) {
  const [texte, setTexte] = useState(choix?.texte ?? "");
  const [estCorrect, setEstCorrect] = useState(choix?.estCorrect ?? false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!texte.trim()) {
      setError("Le texte du choix est obligatoire");
      return;
    }
    setError(null);
    onSubmit({ texte, estCorrect });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Texte du choix
        </label>
        <input
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          placeholder="Ex: L'héritage permet de réutiliser du code"
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      <button
        onClick={() => setEstCorrect((prev) => !prev)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
          estCorrect
            ? "border-green-300 bg-green-50"
            : "border-neutral-200 hover:bg-neutral-50"
        }`}
      >
        <span
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            estCorrect ? "border-green-500 bg-green-500" : "border-neutral-300"
          }`}
        >
          {estCorrect && <span className="text-white text-xs">✓</span>}
        </span>
        <div>
          <p className="text-sm font-medium">
            {estCorrect ? "Réponse correcte" : "Réponse incorrecte"}
          </p>
          <p className="text-xs text-neutral-400">Cliquer pour basculer</p>
        </div>
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end mt-2">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Enregistrement..." : choix ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </div>
  );
}
