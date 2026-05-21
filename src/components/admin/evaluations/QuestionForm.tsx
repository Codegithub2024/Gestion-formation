// components/admin/evaluations/QuestionForm.tsx
import { useState } from "react";
import type { Question } from "../../../types/evaluation.types";
import type { CreateQuestionRequest } from "../../../types/requests.types";
import type { TypeQuestion } from "../../../types/enums.types";

type Props = {
  question: Question | null;
  onSubmit: (data: CreateQuestionRequest) => void;
  isLoading: boolean;
};

export default function QuestionForm({ question, onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<CreateQuestionRequest>({
    enonce: question?.enonce ?? "",
    type: question?.type ?? "QCM",
    points: question?.points ?? 1,
    ordre: question?.ordre,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!form.enonce.trim()) {
      setError("L'énoncé est obligatoire");
      return;
    }
    if (form.points <= 0) {
      setError("Les points doivent être supérieurs à 0");
      return;
    }
    setError(null);
    onSubmit(form);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">Énoncé</label>
        <textarea
          value={form.enonce}
          onChange={(e) => setForm((p) => ({ ...p, enonce: e.target.value }))}
          rows={3}
          placeholder="Quelle est la différence entre..."
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">Type</label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm((p) => ({ ...p, type: e.target.value as TypeQuestion }))
            }
            disabled={question !== null}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-400"
          >
            <option value="QCM">QCM</option>
            <option value="VRAI_FAUX">Vrai / Faux</option>
            <option value="REPONSE_LIBRE">Réponse libre</option>
          </select>
          {question !== null && (
            <p className="text-xs text-neutral-400">
              Le type ne peut pas être modifié après création
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">Points</label>
          <input
            type="number"
            min={0.5}
            step={0.5}
            value={form.points}
            onChange={(e) =>
              setForm((p) => ({ ...p, points: Number(e.target.value) }))
            }
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Indication pour Vrai/Faux */}
      {form.type === "VRAI_FAUX" && question === null && (
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
          <p className="text-xs text-amber-700">
            Après création, ajoutez deux choix : "Vrai" (correct) et "Faux"
            (incorrect).
          </p>
        </div>
      )}

      {/* Indication pour réponse libre */}
      {form.type === "REPONSE_LIBRE" && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-xs text-blue-700">
            Les réponses libres nécessitent une correction manuelle. Les points
            ne seront pas attribués automatiquement.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end mt-2">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Enregistrement..." : question ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </div>
  );
}
