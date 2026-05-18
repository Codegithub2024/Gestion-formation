// components/admin/sessions/SessionTable.tsx
import type { Session } from "../../../types/session.types";
import StatutBadge from "./StatutBadge";

type Props = {
  sessions: Session[];
  isLoading: boolean;
  onVoir: (id: number) => void;
  onSupprimer: (session: Session) => void;
};

export default function SessionTable({
  sessions,
  isLoading,
  onVoir,
  onSupprimer,
}: Props) {
  if (isLoading)
    return <p className="text-sm text-neutral-500">Chargement...</p>;
  if (sessions.length === 0)
    return <p className="text-sm text-neutral-500">Aucune session.</p>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-neutral-500">
          <th className="pb-3 font-medium">Cours</th>
          <th className="pb-3 font-medium">Dates</th>
          <th className="pb-3 font-medium">Lieu</th>
          <th className="pb-3 font-medium">Formateur</th>
          <th className="pb-3 font-medium">Statut</th>
          <th className="pb-3 font-medium">Capacité</th>
          <th className="pb-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {sessions.map((s) => {
          const formateurNom = s.formateurInterne
            ? `${s.formateurInterne.utilisateur.prenom} ${s.formateurInterne.utilisateur.nom}`
            : s.formateurExterne
              ? `${s.formateurExterne.prenom} ${s.formateurExterne.nom}`
              : "—";

          return (
            <tr key={s.id} className="hover:bg-neutral-50 transition-colors">
              <td className="py-3 font-medium">{s.cours?.titre}</td>
              <td className="py-3 text-neutral-500">
                <div className="flex flex-col">
                  <span>
                    {new Date(s.dateDebut).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="text-xs text-neutral-400">
                    → {new Date(s.dateFin).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </td>
              <td className="py-3 text-neutral-500">{s.lieu ?? "—"}</td>
              <td className="py-3 text-neutral-500">{formateurNom}</td>
              <td className="py-3">
                <StatutBadge statut={s.statut} />
              </td>
              <td className="py-3 text-neutral-500">{s.capaciteMax}</td>
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onVoir(s.id)}
                    className="text-xs px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Voir
                  </button>
                  <button
                    onClick={() => onSupprimer(s)}
                    className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
