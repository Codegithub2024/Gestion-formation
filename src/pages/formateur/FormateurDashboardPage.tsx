// pages/formateur/FormateurDashboardPage.tsx
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { formateurProfilService } from "../../services/formateur.profil.service";

export default function FormateurDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: sessions = [] } = useQuery({
    queryKey: ["formateur-sessions"],
    queryFn: formateurProfilService.getSessions,
  });

  const { data: cours = [] } = useQuery({
    queryKey: ["formateur-cours"],
    queryFn: formateurProfilService.getMesCours,
  });

  const { data: evaluations = [] } = useQuery({
    queryKey: ["formateur-evaluations"],
    queryFn: formateurProfilService.getEvaluations,
  });

  // Calculs
  const sessionsEnCours = sessions.filter((s) => s.statut === "EN_COURS");
  const sessionsPlanifiees = sessions.filter((s) => s.statut === "PLANIFIEE");
  const sessionsTerminees = sessions.filter((s) => s.statut === "TERMINEE");
  const sessionsAValider = sessionsTerminees.filter((s) =>
    s.inscriptions?.some((i) => i.present === null),
  );

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Accueil */}
      <div>
        <h1 className="text-xl font-semibold">Bonjour, {user?.prenom} 👋</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Voici un résumé de votre activité
        </p>
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Sessions en cours",
            value: sessionsEnCours.length,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Sessions planifiées",
            value: sessionsPlanifiees.length,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Cours enseignables",
            value: cours.length,
            color: "text-neutral-700",
            bg: "bg-neutral-100",
          },
          {
            label: "Présences à valider",
            value: sessionsAValider.length,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`flex flex-col gap-1 p-4 rounded-xl ${stat.bg}`}
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sessions en cours */}
      {sessionsEnCours.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Sessions en cours</h2>
          <div className="flex flex-col gap-2">
            {sessionsEnCours.map((s) => (
              <div
                key={s.id}
                onClick={() => navigate(`/formateur/sessions/${s.id}`)}
                className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-xl cursor-pointer hover:border-neutral-300 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{s.cours?.titre}</p>
                  <p className="text-xs text-neutral-400">
                    {new Date(s.dateDebut).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(s.dateFin).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                  En cours
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Présences à valider */}
      {sessionsAValider.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-amber-600">
            ⚠ Présences à enregistrer
          </h2>
          <div className="flex flex-col gap-2">
            {sessionsAValider.map((s) => (
              <div
                key={s.id}
                onClick={() => navigate(`/formateur/sessions/${s.id}`)}
                className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl cursor-pointer hover:border-amber-300 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{s.cours?.titre}</p>
                  <p className="text-xs text-neutral-500">
                    Terminée le{" "}
                    {new Date(s.dateFin).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span className="text-xs text-amber-600 font-medium">
                  Enregistrer →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mes cours */}
      {cours.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold">Mes cours enseignables</h2>
          <div className="flex flex-wrap gap-2">
            {cours.map((c) => (
              <span
                key={c.id}
                className="text-sm bg-white border border-neutral-200 px-3 py-1.5 rounded-lg"
              >
                {c.titre}
                <span className="text-xs text-neutral-400 ml-2">
                  {c.domaine?.nom}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
