// components/admin/formateurs/FormateurExterneTable.tsx
import type { FormateurExterne } from "../../../types/formateur.types";
import Table, { BodyTr, TBody, Td, Th, Thead, Tr } from "../../ui/Table";

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
    <Table>
      <Thead>
        <Tr>
          <Th>Nom</Th>
          <Th>Email</Th>
          <Th>Organisme</Th>
          <Th>Cours enseignables</Th>
          <Th right>Actions</Th>
        </Tr>
      </Thead>
      <TBody>
        {formateurs.map((f) => (
          <BodyTr key={f.id}>
            <Td>
              {f.prenom} {f.nom}
            </Td>
            <Td>{f.email}</Td>
            <Td>{f.organisme}</Td>
            <Td>
              {f.coursEnseignables.length === 0 ? (
                <span className="text-neutral-400 text-xs">Aucun cours</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {f.coursEnseignables.map((c) => (
                    <span
                      key={c.id}
                      className="text-xs border font-semibold border-black/10 bg-deep-amber/50 text-dark-amber px-2 py-0.5 rounded-full"
                    >
                      {c.titre}
                    </span>
                  ))}
                </div>
              )}
            </Td>
            <Td>
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
            </Td>
          </BodyTr>
        ))}
      </TBody>
    </Table>
  );
}
