import React, { useEffect, useState } from "react";
import type { Cours } from "../../../types/cours.types";
import type {
  CreateCoursRequest,
  UpdateCoursRequest,
} from "../../../types/requests.types";
import FormError from "../../ui/FormError";
import Input, { Select, Textarea } from "../../ui/Input";
import { useQuery } from "@tanstack/react-query";
import { domaineService } from "../../../services/domaine.service";
import Button from "../../ui/Button";

type CoursFormProps = {
  cours?: Cours | null; // null ou undefined = création, Domaine = édition
  onSubmit: (
    data: CreateCoursRequest | UpdateCoursRequest,
    id?: number, // id présent = update, absent = create
  ) => void;
  isLoading: boolean;
  errorMsg?: string;
};
const emptyForm: CreateCoursRequest = {
  titre: "",
  description: "",
  dureeHeures: 0,
  domaineId: 0,
};

export default function CoursForm({
  cours,
  onSubmit,
  isLoading,
  errorMsg,
}: CoursFormProps) {
  const estEnEdition = cours != null;

  const {
    data: domaines,
    isLoading: isLoadingDomaines,
    error: errorDomaines,
  } = useQuery({
    queryKey: ["domaines"],
    queryFn: () => domaineService.getAll(),
  });

  const [formData, setFormData] = useState<CreateCoursRequest>(emptyForm);

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (cours) {
      setFormData({
        titre: cours.titre,
        description: cours.description ?? "",
        dureeHeures: cours.dureeHeures,
        domaineId: cours.domaine.id,
      });
    }
  }, [cours]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    if (estEnEdition) {
      onSubmit(formData as unknown as UpdateCoursRequest, cours.id);
    } else {
      onSubmit(formData as unknown as CreateCoursRequest);
      console.log(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <Input
          name="titre"
          type="text"
          value={formData.titre}
          onChange={handleChange}
          placeholder="Titre"
          required
        />
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <div className="flex gap-2 items-center">
          <Input
            name="dureeHeures"
            type="number"
            value={formData.dureeHeures}
            onChange={(e) =>
              setFormData({ ...formData, dureeHeures: Number(e.target.value) })
            }
            placeholder="Duree en heures"
            required
          />
          <Select
            name="domaine"
            value={formData.domaineId}
            onChange={(e) =>
              setFormData({ ...formData, domaineId: Number(e.target.value) })
            }
            required
          >
            <option>-- Domaine --</option>
            {domaines?.map((domaine) => (
              <option key={domaine.id} value={domaine.id}>
                {domaine.nom}
              </option>
            ))}
          </Select>
        </div>

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
