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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col rounded-2xl gap-4 w-full"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <Input
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom"
            required
          />
          <Input
            name="prenom"
            type="text"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="Prénom"
            required
          />
        </div>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email (exemple@gmail.com)"
          required
        />

        {!estEnEdition && (
          <Input
            name="motDePasse"
            type="password"
            value={formData.motDePasse}
            onChange={handleChange}
            placeholder="Mot de passe"
            required
          />
        )}
        <Select
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
          required
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

      <div className="flex justify-end items-center pt-4">
        <Button
          type="submit"
          state={isLoading}
          text={
            estEnEdition
              ? `Modifier ${utilisateur.nom}`
              : "Ajouter un utilisateur"
          }
          buttonStyle="amber"
        />
      </div>
    </form>
  );
}
