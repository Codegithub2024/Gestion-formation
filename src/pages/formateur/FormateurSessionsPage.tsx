// pages/formateur/FormateurSessionsPage.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { formateurProfilService } from "../../services/formateur.profil.service";
import type { StatutSession } from "../../types/enums.types";

const STATUT_STYLES: Record<string, string> = {
  PLANIFIEE: "bg-blue-100 text-blue-700",
  EN_COURS: "bg-green-100 text-green-700",
  TERMINEE: "bg-neutral-100 text-neutral-600",
  ANNULEE: "bg-red-100 text-red-600",
};

const STATUT_LABELS: Record<string, string> = {
  PLANIFIEE: "Planifiée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};

export default function FormateurSessionsPage() {
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState<StatutSession | "TOUS">("TOUS");

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["formateur-sessions"],
    queryFn: formateurProfilService.getSessions,
  });

  const sessionsFiltrees =
    filtre === "TOUS" ? sessions : sessions.filter((s) => s.statut === filtre);

  const comptes = {
    TOUS: sessions.length,
    PLANIFIEE: sessions.filter((s) => s.statut === "PLANIFIEE").length,
    EN_COURS: sessions.filter((s) => s.statut === "EN_COURS").length,
    TERMINEE: sessions.filter((s) => s.statut === "TERMINEE").length,
    ANNULEE: sessions.filter((s) => s.statut === "ANNULEE").length,
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Mes sessions</h1>
        <p className="text-sm text-neutral-500">
          {sessions.length} session(s) assignée(s)
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {(
          ["TOUS", "PLANIFIEE", "EN_COURS", "TERMINEE", "ANNULEE"] as const
        ).map((f) => (
          <button
            key={f}
            onClick={() => setFiltre(f)}
            className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 transition-colors ${
              filtre === f
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {f === "TOUS" ? "Toutes" : STATUT_LABELS[f]}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                filtre === f ? "bg-white/20" : "bg-neutral-200"
              }`}
            >
              {comptes[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Liste */}
      {isLoading ? (
        <p className="text-sm text-neutral-500">Chargement...</p>
      ) : sessionsFiltrees.length === 0 ? (
        <p className="text-sm text-neutral-500">Aucune session.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {sessionsFiltrees.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(`/formateur/sessions/${s.id}`)}
              className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-xl cursor-pointer hover:border-neutral-300 transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium">{s.cours?.titre}</p>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      STATUT_STYLES[s.statut]
                    }`}
                  >
                    {STATUT_LABELS[s.statut]}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-neutral-400">
                  <span>
                    {new Date(s.dateDebut).toLocaleDateString("fr-FR")} →{" "}
                    {new Date(s.dateFin).toLocaleDateString("fr-FR")}
                  </span>
                  {s.lieu && <span>📍 {s.lieu}</span>}
                  <span>👥 {s.capacite} places</span>
                </div>
              </div>
              <span className="text-neutral-400 text-sm">→</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
