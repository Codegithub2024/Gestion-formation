import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { candidatAdminService } from "../../../services/candidat.admin.service";

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
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-neutral-500">
              <th className="pb-3 font-medium">Nom</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Inscrit le</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {candidats.map((c) => (
              <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                <td className="py-3 font-medium">
                  {c.prenom} {c.nom}
                </td>
                <td className="py-3 text-neutral-500">{c.email}</td>
                <td className="py-3 text-neutral-500">
                  {new Date(c.dateCreation).toLocaleDateString("fr-FR")}
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => navigate(`/admin/candidats/${c.id}`)}
                    className="text-xs px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Voir le profil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
