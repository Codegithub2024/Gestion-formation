import { Crown, CrownIcon, Edit, Mail, Trash2 } from "lucide-react";
import type { Utilisateur } from "../../../types/utilisateur.types";
import Table, { BodyTr, TBody, Td, Th, Thead, Tr } from "../../ui/Table";

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
  function ShowProfile({ nom, role }: { nom: string; role: string }) {
    return (
      <div
        className={`size-8 relative rounded-full inline-flex text-white font-medium justify-center items-center ${role === "ADMIN" ? "bg-amber-500" : "bg-primary-amber-text"}`}
      >
        {role === "ADMIN" && (
          <Crown
            className="absolute -top-1.5 fill-amber-500 -left-4.5 -rotate-45 w-full text-amber-500"
            size={12}
          />
        )}
        {nom.charAt(0).toUpperCase()}
      </div>
    );
  }

  function EmailBadge({ email }: { email: string }) {
    return (
      <div className="flex gap-2 items-center">
        <div className="rounded-md flex items-center bg-white border border-neutral-200 divide-x divide-neutral-200">
          <div className="p-1">
            <Mail size={16} className="text-primary-amber-text stroke-3" />
          </div>
          <p className="text-sm leading-0 p-1">{email}</p>
        </div>
      </div>
    );
  }
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
    <Table>
      <Thead>
        <Tr>
          <Th>Nom</Th>
          <Th>Prénom</Th>
          <Th>email</Th>
          <Th right>Actions</Th>
        </Tr>
      </Thead>
      <TBody>
        {utilisateurs &&
          utilisateurs.map((utilisateur) => (
            <BodyTr key={utilisateur.id}>
              <Td>
                <div className="flex items-center gap-3 font-medium">
                  <ShowProfile nom={utilisateur.nom} role={utilisateur.role} />
                  {utilisateur.nom}
                </div>
              </Td>
              <Td>{utilisateur.prenom}</Td>
              <Td>
                <EmailBadge email={utilisateur.email} />
              </Td>
              <Td right>
                <div className="flex gap-2 items-center justify-end">
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
                </div>
              </Td>
            </BodyTr>
          ))}
      </TBody>
    </Table>
  );
}
