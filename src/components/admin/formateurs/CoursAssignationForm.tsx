// components/admin/formateurs/CoursAssignationForm.tsx
import type { Cours } from "../../../types/cours.types";

type Props = {
  coursAssignes: Cours[];
  coursDisponibles: Cours[];
  onAssigner: (coursId: number) => void;
  onRetirer: (coursId: number) => void;
  isLoading: boolean;
};

export default function CoursAssignationForm({
  coursAssignes,
  coursDisponibles,
  onAssigner,
  onRetirer,
  isLoading,
}: Props) {
  return (
    <div className="flex flex-col gap-5 p-10">
      {/* Cours déjà assignés */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-neutral-700">
          Cours enseignables ({coursAssignes.length})
        </p>
        {coursAssignes.length === 0 ? (
          <p className="text-xs text-neutral-400">Aucun cours assigné</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {coursAssignes.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center px-3 py-2 bg-neutral-50 rounded-lg"
              >
                <span className="text-sm">{c.titre}</span>
                <button
                  onClick={() => onRetirer(c.id)}
                  disabled={isLoading}
                  className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                >
                  Retirer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cours disponibles à assigner */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-neutral-700">Ajouter un cours</p>
        {coursDisponibles.length === 0 ? (
          <p className="text-xs text-neutral-400">
            Tous les cours actifs sont déjà assignés
          </p>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            {coursDisponibles.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center px-3 py-2 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-sm">{c.titre}</span>
                  <span className="text-xs text-neutral-400">
                    {c.domaine.nom}
                  </span>
                </div>
                <button
                  onClick={() => onAssigner(c.id)}
                  disabled={isLoading}
                  className="text-xs text-neutral-900 font-medium hover:underline disabled:opacity-50 transition-colors"
                >
                  Assigner
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
