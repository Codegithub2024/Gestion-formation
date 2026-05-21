import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { candidatAdminService } from "../../../services/candidat.admin.service";
import Table, {
  BodyTr,
  TBody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../../components/ui/Table";

export default function CandidatsPage() {
  const navigate = useNavigate();

  const { data: candidats = [], isLoading } = useQuery({
    queryKey: ["admin-candidats"],
    queryFn: candidatAdminService.getAll,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Candidats</h1>
        <p className="text-sm text-neutral-500">
          {candidats.length} candidat(s) enregistré(s)
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Chargement...</p>
      ) : candidats.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-4xl mb-3">👤</p>
          <p className="text-sm">Aucun candidat enregistré.</p>
        </div>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Nom</Th>
              <Th>Email</Th>
              <Th>Inscrit le</Th>
              <Th right>Actions</Th>
            </Tr>
          </Thead>
          <TBody>
            {candidats.map((c) => (
              <BodyTr key={c.id}>
                <Td>
                  {c.prenom} {c.nom}
                </Td>
                <Td>{c.email}</Td>
                <Td>{new Date(c.dateCreation).toLocaleDateString("fr-FR")}</Td>
                <Td right>
                  <button
                    onClick={() => navigate(`/admin/candidats/${c.id}`)}
                    className="text-xs px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Voir le profil
                  </button>
                </Td>
              </BodyTr>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
