// components/admin/evaluations/EvaluationForm.tsx
import { useState } from "react";
import type { Evaluation } from "../../../types/evaluation.types";
import type { Domaine } from "../../../types/domaine.types";
import type { Session } from "../../../types/session.types";
import type {
  CreateEvaluationRequest,
  UpdateEvaluationRequest,
} from "../../../types/requests.types";

type Props = {
  evaluation: Evaluation | null;
  domaines: Domaine[];
  sessions: Session[];
  onSubmit: (data: CreateEvaluationRequest | UpdateEvaluationRequest) => void;
  isLoading: boolean;
};

export default function EvaluationForm({
  evaluation,
  domaines,
  sessions,
  onSubmit,
  isLoading,
}: Props) {
  const estEnEdition = evaluation !== null;

  const [form, setForm] = useState({
    titre: evaluation?.titre ?? "",
    description: evaluation?.description ?? "",
    domaineId: evaluation?.domaine?.id ?? "",
    sessionId: evaluation?.session?.id ?? "",
    dateDebut: evaluation?.dateDebut?.slice(0, 16) ?? "",
    dateFin: evaluation?.dateFin?.slice(0, 16) ?? "",
    dureeMinutes: evaluation?.dureeMinutes ?? 60,
    noteMaximale: evaluation?.noteMaximale ?? 20,
    seuilReussite: evaluation?.seuilReussite ?? 10,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.titre.trim()) {
      setError("Le titre est obligatoire");
      return;
    }
    if (!form.domaineId) {
      setError("Le domaine est obligatoire");
      return;
    }
    if (!form.dateDebut || !form.dateFin) {
      setError("Les dates sont obligatoires");
      return;
    }
    if (new Date(form.dateDebut) >= new Date(form.dateFin)) {
      setError("La date de début doit être avant la date de fin");
      return;
    }
    if (Number(form.seuilReussite) > Number(form.noteMaximale)) {
      setError("Le seuil de réussite ne peut pas dépasser la note maximale");
      return;
    }
    setError(null);

    const data = {
      titre: form.titre,
      description: form.description || undefined,
      domaineId: Number(form.domaineId),
      sessionId: form.sessionId ? Number(form.sessionId) : undefined,
      dateDebut: form.dateDebut,
      dateFin: form.dateFin,
      dureeMinutes: Number(form.dureeMinutes),
      noteMaximale: Number(form.noteMaximale),
      seuilReussite: Number(form.seuilReussite),
    };

    onSubmit(data);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Titre */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">Titre</label>
        <input
          name="titre"
          value={form.titre}
          onChange={handleChange}
          placeholder="Ex: Évaluation Java avancé"
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Description{" "}
          <span className="text-neutral-400 font-normal">(optionnel)</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={2}
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
        />
      </div>

      {/* Domaine + Session */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Domaine
          </label>
          <select
            name="domaineId"
            value={form.domaineId}
            onChange={handleChange}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="">Sélectionner...</option>
            {domaines.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Session liée{" "}
            <span className="text-neutral-400 font-normal">(optionnel)</span>
          </label>
          <select
            name="sessionId"
            value={form.sessionId}
            onChange={handleChange}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="">Aucune</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.cours?.titre} —{" "}
                {new Date(s.dateDebut).toLocaleDateString("fr-FR")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">Début</label>
          <input
            type="datetime-local"
            name="dateDebut"
            value={form.dateDebut}
            onChange={handleChange}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">Fin</label>
          <input
            type="datetime-local"
            name="dateFin"
            value={form.dateFin}
            onChange={handleChange}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Durée + Notes */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Durée (min)
          </label>
          <input
            type="number"
            name="dureeMinutes"
            min={1}
            value={form.dureeMinutes}
            onChange={handleChange}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Note max
          </label>
          <input
            type="number"
            name="noteMaximale"
            min={1}
            value={form.noteMaximale}
            onChange={handleChange}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Seuil réussite
          </label>
          <input
            type="number"
            name="seuilReussite"
            min={0}
            value={form.seuilReussite}
            onChange={handleChange}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end mt-2">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading
            ? "Enregistrement..."
            : estEnEdition
              ? "Modifier"
              : "Créer"}
        </button>
      </div>
    </div>
  );
}
