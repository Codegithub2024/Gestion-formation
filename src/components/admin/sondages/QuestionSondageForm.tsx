// components/admin/sondages/QuestionSondageForm.tsx
import { useState } from "react";
import type { QuestionSondage } from "../../../types/sondage.types";
import type { CreateQuestionSondageRequest } from "../../../types/requests.types";
import type { TypeQuestion } from "../../../types/enums.types";

type Props = {
  question: QuestionSondage | null;
  onSubmit: (data: CreateQuestionSondageRequest) => void;
  isLoading: boolean;
};

export default function QuestionSondageForm({
  question,
  onSubmit,
  isLoading,
}: Props) {
  const [form, setForm] = useState<CreateQuestionSondageRequest>({
    enonce: question?.enonce ?? "",
    type: question?.type ?? "QCM",
    ordre: question?.ordre,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!form.enonce.trim()) {
      setError("L'énoncé est obligatoire");
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
          placeholder="Ex: Comment évaluez-vous la qualité de la formation ?"
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Type de réponse
        </label>
        <div className="flex flex-col gap-2">
          {(
            [
              {
                value: "QCM",
                label: "Choix unique",
                desc: "Le répondant choisit parmi des options prédéfinies",
              },
              {
                value: "VRAI_FAUX",
                label: "Vrai / Faux",
                desc: "Oui ou Non, D'accord ou Pas d'accord",
              },
              {
                value: "REPONSE_LIBRE",
                label: "Réponse libre",
                desc: "Le répondant saisit librement son avis",
              },
            ] as const
          ).map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() =>
                !question && setForm((p) => ({ ...p, type: type.value }))
              }
              disabled={!!question}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                form.type === type.value
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 hover:bg-neutral-50"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  form.type === type.value
                    ? "border-neutral-900 bg-neutral-900"
                    : "border-neutral-300"
                }`}
              />
              <div>
                <p className="text-sm font-medium">{type.label}</p>
                <p className="text-xs text-neutral-400">{type.desc}</p>
              </div>
            </button>
          ))}
        </div>
        {question && (
          <p className="text-xs text-neutral-400">
            Le type ne peut pas être modifié après création
          </p>
        )}
      </div>

      {form.type !== "REPONSE_LIBRE" && !question && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-xs text-blue-700">
            Après création, ajoutez les options que les répondants pourront
            sélectionner.
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
