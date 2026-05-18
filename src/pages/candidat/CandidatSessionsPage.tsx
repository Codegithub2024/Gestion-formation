import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { candidatService } from "../../services/candidat.service";

type Onglet = "disponibles" | "mes-inscriptions";

const STATUT_STYLES: Record<string, string> = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMEE: "bg-green-100 text-green-700",
  LISTE_ATTENTE: "bg-blue-100 text-blue-700",
  ANNULEE: "bg-red-100 text-red-600",
};

const STATUT_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  LISTE_ATTENTE: "Liste d'attente",
  ANNULEE: "Annulée",
};

export default function CandidatSessionsPage() {
  const [onglet, setOnglet] = useState<Onglet>("disponibles");
  const queryClient = useQueryClient();

  const { data: sessionsDisponibles = [], isLoading: loadingDisponibles } =
    useQuery({
      queryKey: ["candidat-sessions-disponibles"],
      queryFn: candidatService.getSessionsDisponibles,
    });

  const { data: inscriptions = [], isLoading: loadingInscriptions } = useQuery({
    queryKey: ["candidat-inscriptions"],
    queryFn: candidatService.getMesInscriptions,
  });

  const inscriptionMutation = useMutation({
    mutationFn: (sessionId: number) => candidatService.sInscrire(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidat-inscriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["candidat-sessions-disponibles"],
      });
      toast.success("Inscription effectuée");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const desinscriptionMutation = useMutation({
    mutationFn: (sessionId: number) => candidatService.seDesinscrire(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidat-inscriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["candidat-sessions-disponibles"],
      });
      toast.success("Désinscription effectuée");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // IDs des sessions où le candidat est déjà inscrit
  const sessionsInscritIds = new Set(
    inscriptions
      .filter((i) => i.statut !== "ANNULEE")
      .map((i) => i.session?.id),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Sessions de formation</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Inscrivez-vous aux sessions disponibles
        </p>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        {(
          [
            { key: "disponibles", label: "Sessions disponibles" },
            {
              key: "mes-inscriptions",
              label: `Mes inscriptions (${inscriptions.filter((i) => i.statut !== "ANNULEE").length})`,
            },
          ] as const
        ).map((o) => (
          <button
            key={o.key}
            onClick={() => setOnglet(o.key)}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${
              onglet === o.key
                ? "bg-white text-neutral-900 font-medium shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Sessions disponibles */}
      {onglet === "disponibles" && (
        <div className="flex flex-col gap-3">
          {loadingDisponibles ? (
            <p className="text-sm text-neutral-500">Chargement...</p>
          ) : sessionsDisponibles.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-sm">
                Aucune session disponible pour le moment.
              </p>
            </div>
          ) : (
            sessionsDisponibles.map((s) => {
              const dejaInscrit = sessionsInscritIds.has(s.id);
              const placesDispo =
                s.capaciteMax -
                (s.inscriptions?.filter((i) => i.statut === "CONFIRMEE")
                  .length ?? 0);

              return (
                <div
                  key={s.id}
                  className="flex flex-col gap-4 p-5 bg-white border border-neutral-100 rounded-2xl"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">{s.cours?.titre}</p>
                      <p className="text-xs text-neutral-400">
                        {s.cours?.domaine?.nom}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        placesDispo > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {placesDispo > 0
                        ? `${placesDispo} place(s)`
                        : "Liste d'attente"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                    <span>
                      📅 {new Date(s.dateDebut).toLocaleDateString("fr-FR")} →{" "}
                      {new Date(s.dateFin).toLocaleDateString("fr-FR")}
                    </span>
                    {s.lieu && <span>📍 {s.lieu}</span>}
                    {s.formateurInterne && (
                      <span>
                        👤 {s.formateurInterne.utilisateur.prenom}{" "}
                        {s.formateurInterne.utilisateur.nom}
                      </span>
                    )}
                    {s.formateurExterne && (
                      <span>
                        👤 {s.formateurExterne.prenom} {s.formateurExterne.nom}{" "}
                        ({s.formateurExterne.organisme})
                      </span>
                    )}
                  </div>

                  {/* Prérequis */}
                  {s.cours?.prerequis && s.cours.prerequis.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400">
                        Prérequis :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {s.cours.prerequis.map((p) => (
                          <span
                            key={p.id}
                            className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full"
                          >
                            {p.titre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    {dejaInscrit ? (
                      <button
                        onClick={() => desinscriptionMutation.mutate(s.id)}
                        disabled={desinscriptionMutation.isPending}
                        className="text-sm px-4 py-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 disabled:opacity-50 transition-colors"
                      >
                        Se désinscrire
                      </button>
                    ) : (
                      <button
                        onClick={() => inscriptionMutation.mutate(s.id)}
                        disabled={inscriptionMutation.isPending}
                        className="text-sm px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                      >
                        {placesDispo > 0
                          ? "S'inscrire"
                          : "Rejoindre la liste d'attente"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Mes inscriptions */}
      {onglet === "mes-inscriptions" && (
        <div className="flex flex-col gap-3">
          {loadingInscriptions ? (
            <p className="text-sm text-neutral-500">Chargement...</p>
          ) : inscriptions.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm">Vous n'avez aucune inscription.</p>
            </div>
          ) : (
            inscriptions.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-2xl"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    {i.session?.cours?.titre}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {new Date(i.session?.dateDebut).toLocaleDateString("fr-FR")}
                    {i.session?.lieu && ` · ${i.session.lieu}`}
                  </p>
                  {i.present !== null && (
                    <p
                      className={`text-xs font-medium mt-0.5 ${
                        i.present ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {i.present ? "✓ Présent(e)" : "✗ Absent(e)"}
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    STATUT_STYLES[i.statut]
                  }`}
                >
                  {STATUT_LABELS[i.statut]}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
