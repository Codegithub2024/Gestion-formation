import { Edit, Trash2 } from "lucide-react";
import type { Utilisateur } from "../../../types/utilisateur.types";
import Table, { BodyTr, Td, Th, Thead, Tr } from "../../ui/Table";

type UtilisateurTableType = {
  utilisateurs: Utilisateur[];
  onDelete: (id: number) => void;
  onEdit: (utilisateur: Utilisateur) => void;
};

export default function UtilisateurTable({
  utilisateurs,
  onDelete,
  onEdit,
}: UtilisateurTableType) {
  if (utilisateurs.length === 0) {
    return (
      <div className="inline-flex justify-center px-6 py-10 bg-white rounded-2xl">
        <p className="text-neutral-600 text-center font-semibold">
          Aucun utilisateur disponible
        </p>
      </div>
    );
  }

  return (
    <div className="flex rounded-2xl bg-white overflow-hidden mb-10">
      {utilisateurs.length !== 0 && (
        <Table>
          <Thead>
            <Tr>
              <Th>Nom</Th>
              <Th>Prénom</Th>
              <Th>email</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <tbody>
            {utilisateurs &&
              utilisateurs.map((utilisateur) => (
                <BodyTr key={utilisateur.id}>
                  <Td>{utilisateur.nom}</Td>
                  <Td>{utilisateur.prenom}</Td>
                  <Td>{utilisateur.email}</Td>
                  <Td>
                    <button onClick={() => onEdit(utilisateur)}>
                      <Edit
                        size={18}
                        className="text-neutral-500 hover:text-black transition-all duration-200"
                      />
                    </button>
                    <button onClick={() => onDelete(utilisateur.id)}>
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
