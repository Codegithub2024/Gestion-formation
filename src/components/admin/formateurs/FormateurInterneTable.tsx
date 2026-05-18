// components/admin/formateurs/FormateurInterneTable.tsx
import type { FormateurInterne } from "../../../types/formateur.types";

type Props = {
  formateurs: FormateurInterne[];
  isLoading: boolean;
  onSupprimer: (f: FormateurInterne) => void;
  onGererCours: (f: FormateurInterne) => void;
};

export default function FormateurInterneTable({
  formateurs,
  isLoading,
  onSupprimer,
  onGererCours,
}: Props) {
  if (isLoading)
    return <p className="text-sm text-neutral-500">Chargement...</p>;
  if (formateurs.length === 0)
    return <p className="text-sm text-neutral-500">Aucun formateur interne.</p>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-neutral-500">
          <th className="pb-3 font-medium">Nom</th>
          <th className="pb-3 font-medium">Email</th>
          <th className="pb-3 font-medium">Cours enseignables</th>
          <th className="pb-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-200">
        {formateurs.map((f) => (
          <tr key={f.id}>
            <td className="py-3 font-medium">
              {f.utilisateur.prenom} {f.utilisateur.nom}
            </td>
            <td className="py-3 text-neutral-500">{f.utilisateur.email}</td>
            <td className="py-3">
              {f.coursEnseignables.length === 0 ? (
                <span className="text-neutral-400 text-xs">Aucun cours</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {f.coursEnseignables.map((c) => (
                    <span
                      key={c.id}
                      className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full"
                    >
                      {c.titre}
                    </span>
                  ))}
                </div>
              )}
            </td>
            <td className="py-3">
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onGererCours(f)}
                  className="text-xs px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Gérer les cours
                </button>
                <button
                  onClick={() => onSupprimer(f)}
                  className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
