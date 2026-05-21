// components/admin/sessions/SessionForm.tsx
import { useState } from "react";
import type { Session } from "../../../types/session.types";
import type { Cours } from "../../../types/cours.types";
import type {
  FormateurInterne,
  FormateurExterne,
} from "../../../types/formateur.types";
import type {
  CreateSessionRequest,
  UpdateSessionRequest,
} from "../../../types/requests.types";
import Input from "../../ui/Input";
import FormError from "../../ui/FormError";

type Props = {
  session: Session | null;
  cours: Cours[];
  formateursInternes: FormateurInterne[];
  formateursExternes: FormateurExterne[];
  onSubmit: (data: CreateSessionRequest | UpdateSessionRequest) => void;
  isLoading: boolean;
};

export default function SessionForm({
  session,
  cours,
  formateursInternes,
  formateursExternes,
  onSubmit,
  isLoading,
}: Props) {
  const estEnEdition = session !== null;

  const [form, setForm] = useState({
    coursId: session?.cours?.id ?? "",
    formateurInterneId: session?.formateurInterne?.id ?? "",
    formateurExterneId: session?.formateurExterne?.id ?? "",
    dateDebut: session?.dateDebut?.slice(0, 16) ?? "",
    dateFin: session?.dateFin?.slice(0, 16) ?? "",
    lieu: session?.lieu ?? "",
    capacite: session?.capacite ?? undefined,
  });

  // Un seul type de formateur à la fois
  const [typeFormateur, setTypeFormateur] = useState<
    "interne" | "externe" | "aucun"
  >(
    session?.formateurInterne
      ? "interne"
      : session?.formateurExterne
        ? "externe"
        : "aucun",
  );

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.coursId) {
      setError("Le cours est obligatoire");
      return;
    }
    if (!form.dateDebut) {
      setError("La date de début est obligatoire");
      return;
    }
    if (!form.dateFin) {
      setError("La date de fin est obligatoire");
      return;
    }
    if (new Date(form.dateDebut) >= new Date(form.dateFin)) {
      setError("La date de début doit être avant la date de fin");
      return;
    }
    if (!form.capacite || Number(form.capacite) < 1) {
      setError("La capacité doit être supérieure à 0");
      return;
    }
    setError(null);

    const data = {
      ...(estEnEdition ? {} : { coursId: Number(form.coursId) }),
      formateurInterneId:
        typeFormateur === "interne" && form.formateurInterneId
          ? Number(form.formateurInterneId)
          : undefined,
      formateurExterneId:
        typeFormateur === "externe" && form.formateurExterneId
          ? Number(form.formateurExterneId)
          : undefined,
      dateDebut: form.dateDebut,
      dateFin: form.dateFin,
      lieu: form.lieu || undefined,
      capacite: Number(form.capacite),
    };

    // console.log(data);
    onSubmit(
      estEnEdition
        ? (data as UpdateSessionRequest)
        : (data as CreateSessionRequest),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Cours — non modifiable en édition */}
      {!estEnEdition && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">Cours</label>
          <select
            name="coursId"
            value={form.coursId}
            onChange={handleChange}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="">Sélectionner un cours...</option>
            {cours
              .filter((c) => c.actif)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titre} — {c.domaine?.nom}
                </option>
              ))}
          </select>
        </div>
      )}

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

      {/* Lieu + Capacité */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Lieu{" "}
            <span className="text-neutral-400 font-normal">(optionnel)</span>
          </label>
          <input
            name="lieu"
            value={form.lieu}
            onChange={handleChange}
            placeholder="Salle A, En ligne..."
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <Input
          type="number"
          name="capacite"
          min={1}
          value={form.capacite}
          onChange={handleChange}
        />
        {/* </div> */}
      </div>

      {/* Formateur */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-700">
          Formateur{" "}
          <span className="text-neutral-400 font-normal">(optionnel)</span>
        </label>
        <div className="flex gap-2">
          {(["aucun", "interne", "externe"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFormateur(type)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors capitalize ${
                typeFormateur === type
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {typeFormateur === "interne" && (
          <select
            name="formateurInterneId"
            value={form.formateurInterneId}
            onChange={handleChange}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="">Sélectionner...</option>
            {formateursInternes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.utilisateur.prenom} {f.utilisateur.nom}
              </option>
            ))}
          </select>
        )}

        {typeFormateur === "externe" && (
          <select
            name="formateurExterneId"
            value={form.formateurExterneId}
            onChange={handleChange}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="">Sélectionner...</option>
            {formateursExternes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.prenom} {f.nom} — {f.organisme}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && <FormError message={error} />}

      <div className="flex justify-end gap-2 mt-2">
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
