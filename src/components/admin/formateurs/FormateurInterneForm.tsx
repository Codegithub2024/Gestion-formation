// components/admin/formateurs/FormateurInterneForm.tsx
import { useState } from "react";
import type { Utilisateur } from "../../../types/utilisateur.types";

type Props = {
  utilisateurs: Utilisateur[]; // utilisateurs FORMATEUR sans profil
  onSubmit: (utilisateurId: number) => void;
  isLoading: boolean;
};

export default function FormateurInterneForm({
  utilisateurs,
  onSubmit,
  isLoading,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | "">("");

  if (utilisateurs.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-500">
          Aucun utilisateur avec le rôle FORMATEUR disponible. Créez d'abord un
          utilisateur avec ce rôle dans la gestion des utilisateurs.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-10">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Utilisateur
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
        >
          <option value="">Sélectionner un utilisateur...</option>
          {utilisateurs.map((u) => (
            <option key={u.id} value={u.id}>
              {u.prenom} {u.nom} — {u.email}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => {
            if (selectedId !== "") onSubmit(selectedId);
          }}
          disabled={selectedId === "" || isLoading}
          className="px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Création..." : "Créer le profil"}
        </button>
      </div>
    </div>
  );
}
