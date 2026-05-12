import { Edit, Trash2 } from "lucide-react";
import type { Domaine } from "../../../types/domaine.types";
import Table, { BodyTr, Td, Th, Thead, Tr } from "../../ui/Table";

type DomaineTableProps = {
  domaine: Domaine[];
  onDelete: (id: number) => void;
  onEdit: (domaine: Domaine) => void;
};

export default function DomaineTable({
  domaine,
  onDelete,
  onEdit,
}: DomaineTableProps) {
  if (domaine.length === 0) {
    return (
      <div className="inline-flex justify-center px-6 py-10 bg-white rounded-2xl">
        <p className="text-neutral-600 text-center font-semibold">
          Aucun domaine disponible
        </p>
      </div>
    );
  }
  return (
    <div className="flex rounded-2xl bg-white overflow-hidden mb-10">
      {domaine.length !== 0 && (
        <Table>
          <Thead>
            <Tr>
              <Th>Nom</Th>
              <Th>Description</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <tbody className="w-fit">
            {domaine &&
              domaine.map((domaine) => (
                <BodyTr key={domaine.id}>
                  <Td>{domaine.nom}</Td>
                  <Td>{domaine.description || "-"}</Td>
                  <Td>
                    <button onClick={() => onEdit(domaine)}>
                      <Edit
                        size={18}
                        className="text-neutral-500 hover:text-black transition-all duration-200"
                      />
                    </button>
                    <button onClick={() => onDelete(domaine.id)}>
                      <Trash2
                        size={18}
                        className="text-neutral-500 hover:text-black transition-all duration-200"
                      />
                    </button>
                  </Td>
                </BodyTr>
              ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
