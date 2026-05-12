// components/admin/formateurs/FormateurExterneForm.tsx
import { useState } from "react";
import type { FormateurExterne } from "../../../types/formateur.types";
import type { CreateFormateurExterneRequest } from "../../../types/requests.types";

type Props = {
  formateur: FormateurExterne | null;
  onSubmit: (data: CreateFormateurExterneRequest) => void;
  isLoading: boolean;
};

export default function FormateurExterneForm({
  formateur,
  onSubmit,
  isLoading,
}: Props) {
  const estEnEdition = formateur !== null;
  const [form, setForm] = useState<CreateFormateurExterneRequest>({
    nom: formateur?.nom ?? "",
    prenom: formateur?.prenom ?? "",
    email: formateur?.email ?? "",
    telephone: formateur?.telephone ?? "",
    organisme: formateur?.organisme ?? "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (
      !form.nom.trim() ||
      !form.prenom.trim() ||
      !form.email.trim() ||
      !form.organisme.trim()
    ) {
      setError("Nom, prénom, email et organisme sont obligatoires");
      return;
    }
    setError(null);
    onSubmit(form);
  };

  const fields: {
    name: keyof CreateFormateurExterneRequest;
    label: string;
    required: boolean;
  }[] = [
    { name: "prenom", label: "Prénom", required: true },
    { name: "nom", label: "Nom", required: true },
    { name: "email", label: "Email", required: true },
    { name: "organisme", label: "Organisme", required: true },
    { name: "telephone", label: "Téléphone", required: false },
  ];

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            {field.label}
            {!field.required && (
              <span className="text-neutral-400 font-normal ml-1">
                (optionnel)
              </span>
            )}
          </label>
          <input
            name={field.name}
            value={form[field.name] ?? ""}
            onChange={handleChange}
            className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      ))}

      {error && <p className="text-sm text-red-500">{error}</p>}

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
