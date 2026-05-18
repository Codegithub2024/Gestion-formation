import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { candidatService } from "../../services/candidat.service";
import type { UpdateProfilRequest } from "../../types/requests.types";

export default function CandidatProfilPage() {
  const queryClient = useQueryClient();
  const [editionActive, setEditionActive] = useState(false);

  const { data: profil, isLoading } = useQuery({
    queryKey: ["candidat-profil"],
    queryFn: candidatService.getProfil,
  });

  const [form, setForm] = useState<UpdateProfilRequest>({
    nom: "",
    prenom: "",
    motDePasse: "",
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfilRequest) =>
      candidatService.updateProfil(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidat-profil"] });
      toast.success("Profil mis à jour");
      setEditionActive(false);
      setForm((prev) => ({ ...prev, motDePasse: "" }));
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleEditer = () => {
    if (profil) {
      setForm({ nom: profil.nom, prenom: profil.prenom, motDePasse: "" });
    }
    setEditionActive(true);
  };

  if (isLoading)
    return <p className="text-sm text-neutral-500">Chargement...</p>;
  if (!profil) return null;

  return (
    <div className="flex flex-col gap-8 max-w-lg">
      <div>
        <h1 className="text-xl font-semibold">Mon profil</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Avatar initiales */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center">
          <span className="text-white text-xl font-semibold">
            {profil.prenom[0]}
            {profil.nom[0]}
          </span>
        </div>
        <div>
          <p className="text-base font-semibold">
            {profil.prenom} {profil.nom}
          </p>
          <p className="text-sm text-neutral-500">{profil.email}</p>
          <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
            Candidat
          </span>
        </div>
      </div>

      {/* Informations */}
      {!editionActive ? (
        <div className="flex flex-col gap-4">
          {[
            { label: "Prénom", value: profil.prenom },
            { label: "Nom", value: profil.nom },
            { label: "Email", value: profil.email },
          ].map((info) => (
            <div
              key={info.label}
              className="flex justify-between items-center py-3 border-b border-neutral-100"
            >
              <span className="text-sm text-neutral-500">{info.label}</span>
              <span className="text-sm font-medium">{info.value}</span>
            </div>
          ))}

          <button
            onClick={handleEditer}
            className="mt-2 w-full py-3 border border-neutral-200 rounded-xl text-sm hover:bg-neutral-50 transition-colors"
          >
            Modifier mon profil
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {[
            { key: "prenom" as const, label: "Prénom" },
            { key: "nom" as const, label: "Nom" },
          ].map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">
                {field.label}
              </label>
              <input
                value={form[field.key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                className="border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Nouveau mot de passe
              <span className="text-neutral-400 font-normal ml-1">
                (laisser vide pour ne pas changer)
              </span>
            </label>
            <input
              type="password"
              value={form.motDePasse ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, motDePasse: e.target.value }))
              }
              placeholder="••••••••"
              className="border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setEditionActive(false)}
              className="flex-1 py-3 border border-neutral-200 rounded-xl text-sm hover:bg-neutral-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => updateMutation.mutate(form)}
              disabled={updateMutation.isPending}
              className="flex-1 py-3 bg-neutral-900 text-white rounded-xl text-sm disabled:opacity-50 transition-colors"
            >
              {updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
