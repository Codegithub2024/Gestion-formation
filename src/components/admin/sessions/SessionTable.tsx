// components/admin/sessions/SessionTable.tsx
import type { Session } from "../../../types/session.types";
import Table, { BodyTr, TBody, Td, Th, Thead, Tr } from "../../ui/Table";
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
    <Table>
      <Thead>
        <Tr>
          <Th>Cours</Th>
          <Th>Dates</Th>
          <Th>Lieu</Th>
          <Th>Formateur</Th>
          <Th>Statut</Th>
          <Th>Capacité</Th>
          <Th right>Actions</Th>
        </Tr>
      </Thead>
      <TBody>
        {sessions.map((s) => {
          const formateurNom = s.formateurInterne
            ? `${s.formateurInterne.utilisateur.prenom} ${s.formateurInterne.utilisateur.nom}`
            : s.formateurExterne
              ? `${s.formateurExterne.prenom} ${s.formateurExterne.nom}`
              : "—";

          return (
            <BodyTr key={s.id}>
              <Td>{s.cours?.titre}</Td>
              <Td>
                <div className="flex flex-col">
                  <span>
                    {new Date(s.dateDebut).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="text-xs text-neutral-400">
                    → {new Date(s.dateFin).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </Td>
              <Td>{s.lieu ?? "—"}</Td>
              <Td>{formateurNom}</Td>
              <Td>
                <StatutBadge statut={s.statut} />
              </Td>
              <Td>{s.capacite}</Td>
              <Td right>
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
              </Td>
            </BodyTr>
          );
        })}
      </TBody>
    </Table>
  );
}
