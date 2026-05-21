// components/admin/sondages/SondageForm.tsx
import { useState } from "react";
import type { Sondage } from "../../../types/sondage.types";
import type { Domaine } from "../../../types/domaine.types";
import type {
  CreateSondageRequest,
  UpdateSondageRequest,
} from "../../../types/requests.types";

type Props = {
  sondage: Sondage | null;
  domaines: Domaine[];
  onSubmit: (data: CreateSondageRequest | UpdateSondageRequest) => void;
  isLoading: boolean;
};

export default function SondageForm({
  sondage,
  domaines,
  onSubmit,
  isLoading,
}: Props) {
  const estEnEdition = sondage !== null;

  const [form, setForm] = useState({
    titre: sondage?.titre ?? "",
    description: sondage?.description ?? "",
    domaineId: sondage?.domaine?.id ?? "",
    dateDebut: sondage?.dateDebut?.slice(0, 16) ?? "",
    dateFin: sondage?.dateFin?.slice(0, 16) ?? "",
    anonyme: sondage?.anonyme ?? false,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: value }));
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
    setError(null);

    onSubmit({
      titre: form.titre,
      description: form.description || undefined,
      domaineId: Number(form.domaineId),
      dateDebut: form.dateDebut,
      dateFin: form.dateFin,
      anonyme: form.anonyme,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">Titre</label>
        <input
          name="titre"
          value={form.titre}
          onChange={handleChange}
          placeholder="Ex: Satisfaction de la formation Java"
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

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
          placeholder="Objectif du sondage..."
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">Domaine</label>
        <select
          name="domaineId"
          value={form.domaineId}
          onChange={handleChange}
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
        >
          <option value="">Sélectionner un domaine...</option>
          {domaines.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nom}
            </option>
          ))}
        </select>
      </div>

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

      {/* Anonymat */}
      <button
        type="button"
        onClick={() => setForm((p) => ({ ...p, anonyme: !p.anonyme }))}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
          form.anonyme
            ? "border-neutral-900 bg-neutral-50"
            : "border-neutral-200 hover:bg-neutral-50"
        }`}
      >
        <span
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
            form.anonyme
              ? "border-neutral-900 bg-neutral-900"
              : "border-neutral-300"
          }`}
        >
          {form.anonyme && <span className="text-white text-xs">✓</span>}
        </span>
        <div>
          <p className="text-sm font-medium">Réponses anonymes</p>
          <p className="text-xs text-neutral-400">
            Les identités des répondants ne seront pas enregistrées
          </p>
        </div>
      </button>

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
