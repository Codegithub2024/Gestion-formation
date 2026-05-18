import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { candidatService } from "../../services/candidat.service";

export default function CandidatDashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: inscriptions = [] } = useQuery({
    queryKey: ["candidat-inscriptions"],
    queryFn: candidatService.getMesInscriptions,
  });

  const { data: evaluations = [] } = useQuery({
    queryKey: ["candidat-evaluations"],
    queryFn: candidatService.getEvaluations,
  });

  const { data: resultats = [] } = useQuery({
    queryKey: ["candidat-resultats"],
    queryFn: candidatService.getMesResultats,
  });

  const { data: sondages = [] } = useQuery({
    queryKey: ["candidat-sondages"],
    queryFn: candidatService.getSondages,
  });

  // Calculs
  const sessionsConfirmees = inscriptions.filter(
    (i) => i.statut === "CONFIRMEE",
  );
  const sessionsEnAttente = inscriptions.filter(
    (i) => i.statut === "EN_ATTENTE",
  );
  const evaluationsEnCours = evaluations.filter((e) => e.statut === "EN_COURS");
  const evaluationsDejaPasses = resultats.map((r) => r.evaluation?.id);
  const evaluationsAFaire = evaluationsEnCours.filter(
    (e) => !evaluationsDejaPasses.includes(e.id),
  );
  const tauxReussite =
    resultats.length > 0
      ? Math.round(
          (resultats.filter((r) => r.reussi).length / resultats.length) * 100,
        )
      : null;

  return (
    <div className="flex flex-col gap-10">
      {/* Accueil personnalisé */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Bonjour, {user?.prenom} 👋
        </h1>
        <p className="text-neutral-500 mt-1">
          Voici un aperçu de votre parcours de formation.
        </p>
      </div>

      {/* Cartes résumé */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Sessions confirmées",
            value: sessionsConfirmees.length,
            sub: `${sessionsEnAttente.length} en attente`,
            color: "text-green-600",
            bg: "bg-green-50",
            onClick: () => navigate("/candidat/sessions"),
          },
          {
            label: "Évaluations à faire",
            value: evaluationsAFaire.length,
            sub: `${evaluationsEnCours.length} disponible(s)`,
            color: "text-blue-600",
            bg: "bg-blue-50",
            onClick: () => navigate("/candidat/evaluations"),
          },
          {
            label: "Taux de réussite",
            value: tauxReussite !== null ? `${tauxReussite}%` : "—",
            sub: `${resultats.length} évaluation(s) passée(s)`,
            color: "text-violet-600",
            bg: "bg-violet-50",
            onClick: () => navigate("/candidat/evaluations"),
          },
          {
            label: "Sondages ouverts",
            value: sondages.length,
            sub: "à compléter",
            color: "text-amber-600",
            bg: "bg-amber-50",
            onClick: () => navigate("/candidat/sondages"),
          },
        ].map((card) => (
          <div
            key={card.label}
            onClick={card.onClick}
            className={`flex flex-col gap-2 p-4 rounded-2xl cursor-pointer transition-transform hover:scale-[1.02] ${card.bg}`}
          >
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <div>
              <p className="text-sm font-medium text-neutral-700">
                {card.label}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mes prochaines sessions */}
      {sessionsConfirmees.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold">Mes prochaines sessions</h2>
            <button
              onClick={() => navigate("/candidat/sessions")}
              className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Voir tout →
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {sessionsConfirmees.slice(0, 3).map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">
                    {i.session?.cours?.titre}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {i.session?.lieu ?? "Lieu non défini"} ·{" "}
                    {new Date(i.session?.dateDebut).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                  Confirmée
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Évaluations à faire */}
      {evaluationsAFaire.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold text-blue-700">
              Évaluations disponibles
            </h2>
            <button
              onClick={() => navigate("/candidat/evaluations")}
              className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Voir tout →
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {evaluationsAFaire.slice(0, 3).map((e) => (
              <div
                key={e.id}
                onClick={() => navigate(`/candidat/evaluations/${e.id}/passer`)}
                className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl cursor-pointer hover:border-blue-300 transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">{e.titre}</p>
                  <p className="text-xs text-neutral-500">
                    {e.domaine?.nom} · {e.dureeMinutes} min · Note max :{" "}
                    {e.noteMaximale}
                  </p>
                </div>
                <span className="text-xs text-blue-600 font-medium">
                  Commencer →
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sondages ouverts */}
      {sondages.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">Sondages à compléter</h2>
          <div className="flex flex-col gap-2">
            {sondages.slice(0, 2).map((s) => (
              <div
                key={s.id}
                onClick={() => navigate("/candidat/sondages")}
                className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-xl cursor-pointer hover:border-amber-300 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{s.titre}</p>
                  <p className="text-xs text-neutral-500">
                    {s.domaine?.nom} · {s.anonyme ? "Anonyme" : "Nominatif"}
                  </p>
                </div>
                <span className="text-xs text-amber-600 font-medium">
                  Répondre →
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
