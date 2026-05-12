// components/admin/domaines/DomaineForm.tsx
import { useState } from "react";
import type { Domaine } from "../../../types/domaine.types";
import type {
  CreateDomaineRequest,
  UpdateDomaineRequest,
} from "../../../types/requests.types";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import FormError from "../../ui/FormError";

type DomaineFormProps = {
  domaine?: Domaine | null; // null ou undefined = création, Domaine = édition
  onSubmit: (
    data: CreateDomaineRequest | UpdateDomaineRequest,
    id?: number, // id présent = update, absent = create
  ) => void;
  isLoading: boolean;
  errorMsg?: string;
};

export default function DomaineForm({
  domaine,
  onSubmit,
  isLoading,
  errorMsg,
}: DomaineFormProps) {
  const estEnEdition = domaine != null;

  const [formData, setFormData] = useState({
    nom: domaine?.nom ?? "",
    description: domaine?.description ?? "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nom.trim()) {
      setError("Le nom est obligatoire");
      return;
    }

    setError(null);

    if (estEnEdition) {
      // Édition → on passe les données ET l'id
      onSubmit(formData, domaine.id);
    } else {
      // Création → on passe juste les données
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full p-6">
      <div className="flex flex-col gap-2">
        <Input
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Nom du domaine"
          required
        />
        <Input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description (optionnel)"
        />
        {error && <FormError message={error} />}
        {errorMsg && <FormError message={errorMsg} />}
      </div>

      <Button
        type="submit"
        state={isLoading}
        text={estEnEdition ? "Modifier" : "Créer"}
        buttonStyle="amber"
      />
    </form>
  );
}
