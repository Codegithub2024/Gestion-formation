// components/admin/formateurs/FormateurExterneTable.tsx
import type { FormateurExterne } from "../../../types/formateur.types";

type Props = {
  formateurs: FormateurExterne[];
  isLoading: boolean;
  onEditer: (f: FormateurExterne) => void;
  onSupprimer: (f: FormateurExterne) => void;
  onGererCours: (f: FormateurExterne) => void;
};

export default function FormateurExterneTable({
  formateurs,
  isLoading,
  onEditer,
  onSupprimer,
  onGererCours,
}: Props) {
  if (isLoading)
    return <p className="text-sm text-neutral-500">Chargement...</p>;
  if (formateurs.length === 0)
    return <p className="text-sm text-neutral-500">Aucun formateur externe.</p>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-neutral-500">
          <th className="pb-3 font-medium">Nom</th>
          <th className="pb-3 font-medium">Email</th>
          <th className="pb-3 font-medium">Organisme</th>
          <th className="pb-3 font-medium">Cours enseignables</th>
          <th className="pb-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {formateurs.map((f) => (
          <tr key={f.id}>
            <td className="py-3 font-medium">
              {f.prenom} {f.nom}
            </td>
            <td className="py-3 text-neutral-500">{f.email}</td>
            <td className="py-3 text-neutral-500">{f.organisme}</td>
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
                  Cours
                </button>
                <button
                  onClick={() => onEditer(f)}
                  className="text-xs px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Modifier
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
