import { Pen, Trash2 } from "lucide-react";
import type { Cours } from "../../../types/cours.types";
import Table, { BodyTr, TBody, Td, Th, Thead, Tr } from "../../ui/Table";

type CoursTableProps = {
  cours: Cours[];
  onEdit: (cours: Cours) => void;
  onDelete: (id: number) => void;
};

export default function CoursTable({
  cours,
  onEdit,
  onDelete,
}: CoursTableProps) {
  if (cours.length === 0) {
    return (
      <div className="inline-flex justify-center px-6 py-10 bg-white rounded-2xl">
        <p className="text-neutral-600 text-center font-semibold">
          Aucune cours disponible
        </p>
      </div>
    );
  }

  const badge = (actif: boolean) => {
    return actif ? (
      <p className="text-sm flex justify-start items-center gap-2 font-medium mr-2 px-2.5 py-0.5 rounded-full text-neutral-800">
        <span className="size-2 rounded-full bg-teal-600 animate-pulse"></span>
        Actif
      </p>
    ) : (
      <p className="text-sm flex justify-start items-center gap-2 font-medium mr-2 px-2.5 py-0.5 rounded-full text-neutral-800">
        <span className="size-2 rounded-full bg-rose-600 animate-pulse"></span>
        Inactif
      </p>
    );
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Titre</Th>
          <Th>Domaine</Th>
          <Th>Durée</Th>
          <Th>Status</Th>
          <Th right>Actions</Th>
        </Tr>
      </Thead>
      <TBody>
        {cours.map((cours) => (
          <BodyTr key={cours.id}>
            <Td>{cours.titre}</Td>
            <Td>{cours.domaine.nom}</Td>
            <Td>{cours.dureeHeures}h</Td>
            <Td>{badge(cours.actif)}</Td>
            <Td right>
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => onEdit(cours)}>
                  <Pen size={18} />
                </button>
                <button onClick={() => onDelete(cours.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </Td>
          </BodyTr>
        ))}
      </TBody>
    </Table>
  );
}
