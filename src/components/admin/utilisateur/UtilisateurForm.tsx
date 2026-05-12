import { useState } from "react";
import type {
  CreateUtilisateurRequest,
  UpdateUtilisateurRequest,
} from "../../../types/requests.types";
import type { Utilisateur } from "../../../types/utilisateur.types";
import Button from "../../ui/Button";
import Input, { Select } from "../../ui/Input";
import FormError from "../../ui/FormError";

interface UtilisateurFormProps {
  utilisateur: Utilisateur | null;
  onSubmit: (
    data: CreateUtilisateurRequest | UpdateUtilisateurRequest,
    id?: number,
  ) => void;
  isLoading: boolean;
  errorMsg?: string;
}

const ROLES = ["CANDIDAT", "ADMIN", "GESTIONNAIRE_FORMATION", "FORMATEUR"];

export default function UtilisateurForm({
  utilisateur,
  onSubmit,
  isLoading,
  errorMsg,
}: UtilisateurFormProps) {
  const estEnEdition = utilisateur != null;

  const [formData, setFormData] = useState({
    nom: utilisateur?.nom ?? "",
    prenom: utilisateur?.prenom ?? "",
    email: utilisateur?.email ?? "",
    motDePasse: undefined,
    role: utilisateur?.role ?? "CANDIDAT",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    if (estEnEdition) {
      onSubmit(
        formData as unknown as UpdateUtilisateurRequest,
        utilisateur!.id,
      );
    } else {
      onSubmit(formData as unknown as CreateUtilisateurRequest);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full p-10">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <Input
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom"
          />
          <Input
            name="prenom"
            type="text"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="Prénom"
          />
        </div>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email (exemple@gmail.com)"
        />

        {!estEnEdition && (
          <Input
            name="motDePasse"
            type="password"
            value={formData.motDePasse}
            onChange={handleChange}
            placeholder="Mot de passe"
          />
        )}
        <Select
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
        >
          {ROLES.map((role) => (
            <option id="role" value={role}>
              {role}
            </option>
          ))}
        </Select>

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
