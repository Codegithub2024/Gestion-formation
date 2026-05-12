import { Pen, Trash2 } from "lucide-react";
import type { Cours } from "../../../types/cours.types";
import Table, { BodyTr, Td, Th, Thead, Tr } from "../../ui/Table";

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
      <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
        Actif
      </span>
    ) : (
      <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
        Inactif
      </span>
    );
  };

  return (
    <div className=" flex rounded-2xl overflow-hidden mb-10">
      <Table>
        <Thead>
          <Tr>
            <Th>Titre</Th>
            <Th>Domaine</Th>
            <Th>Durée</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <tbody>
          {cours.map((cours) => (
            <BodyTr key={cours.id}>
              <Td>{cours.titre}</Td>
              <Td>{cours.domaine.nom}</Td>
              <Td>{cours.dureeHeures}h</Td>
              <Td>{badge(cours.actif)}</Td>
              <Td>
                <div className="flex items-center gap-2">
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
        </tbody>
      </Table>
    </div>
  );
}
