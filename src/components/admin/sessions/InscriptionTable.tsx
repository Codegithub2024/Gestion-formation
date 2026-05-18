// components/admin/sessions/InscriptionTable.tsx
import type { Inscription } from "../../../types/session.types";
import type { StatutSession } from "../../../types/enums.types";

type Props = {
  inscriptions: Inscription[];
  isLoading: boolean;
  sessionStatut: StatutSession;
  onConfirmer: (id: number) => void;
  onAnnuler: (id: number) => void;
  isConfirming: boolean;
  isAnnuling: boolean;
};

const STATUT_STYLES: Record<string, string> = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMEE: "bg-green-100 text-green-700",
  LISTE_ATTENTE: "bg-blue-100 text-blue-700",
  ANNULEE: "bg-red-100 text-red-600",
};

const STATUT_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  LISTE_ATTENTE: "Liste d'attente",
  ANNULEE: "Annulée",
};

export default function InscriptionTable({
  inscriptions,
  isLoading,
  sessionStatut,
  onConfirmer,
  onAnnuler,
  isConfirming,
  isAnnuling,
}: Props) {
  if (isLoading)
    return <p className="text-sm text-neutral-500">Chargement...</p>;
  if (inscriptions.length === 0)
    return (
      <p className="text-sm text-neutral-500">
        Aucune inscription pour ce filtre.
      </p>
    );

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-neutral-500">
          <th className="pb-3 font-medium">Candidat</th>
          <th className="pb-3 font-medium">Email</th>
          <th className="pb-3 font-medium">Date d'inscription</th>
          <th className="pb-3 font-medium">Statut</th>
          {sessionStatut === "TERMINEE" && (
            <th className="pb-3 font-medium">Présence</th>
          )}
          <th className="pb-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {inscriptions.map((i) => (
          <tr key={i.id}>
            <td className="py-3 font-medium">
              {i.utilisateur.prenom} {i.utilisateur.nom}
            </td>
            <td className="py-3 text-neutral-500">{i.utilisateur.email}</td>
            <td className="py-3 text-neutral-500">
              {new Date(i.dateInscription).toLocaleDateString("fr-FR")}
            </td>
            <td className="py-3">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  STATUT_STYLES[i.statut] ?? "bg-neutral-100 text-neutral-600"
                }`}
              >
                {STATUT_LABELS[i.statut] ?? i.statut}
              </span>
            </td>
            {sessionStatut === "TERMINEE" && (
              <td className="py-3">
                {i.present === null ? (
                  <span className="text-xs text-neutral-400">—</span>
                ) : i.present ? (
                  <span className="text-xs text-green-600 font-medium">
                    Présent
                  </span>
                ) : (
                  <span className="text-xs text-red-500 font-medium">
                    Absent
                  </span>
                )}
              </td>
            )}
            <td className="py-3">
              <div className="flex justify-end gap-2">
                {i.statut === "EN_ATTENTE" && (
                  <button
                    onClick={() => onConfirmer(i.id)}
                    disabled={isConfirming}
                    className="text-xs px-3 py-1.5 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 disabled:opacity-50 transition-colors"
                  >
                    Confirmer
                  </button>
                )}
                {(i.statut === "EN_ATTENTE" || i.statut === "CONFIRMEE") && (
                  <button
                    onClick={() => onAnnuler(i.id)}
                    disabled={isAnnuling}
                    className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
