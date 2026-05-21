import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { candidatAdminService } from "../../../services/candidat.admin.service";

type Onglet = "inscriptions" | "evaluations";

const STATUT_INSCRIPTION_STYLES: Record<string, string> = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMEE: "bg-green-100 text-green-700",
  LISTE_ATTENTE: "bg-blue-100 text-blue-700",
  ANNULEE: "bg-red-100 text-red-600",
};

const STATUT_INSCRIPTION_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  LISTE_ATTENTE: "Liste d'attente",
  ANNULEE: "Annulée",
};

export default function CandidatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [onglet, setOnglet] = useState<Onglet>("inscriptions");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-candidat", id],
    queryFn: () => candidatAdminService.getDetail(Number(id)),
  });

  if (isLoading)
    return <p className="p-6 text-sm text-neutral-500">Chargement...</p>;
  if (!data)
    return <p className="p-6 text-sm text-red-500">Candidat introuvable</p>;

  const { candidat, inscriptions, resultats } = data;

  // ── Calculs analytiques ───────────────────────────────────────────────────
  const inscriptionsConfirmees = inscriptions.filter(
    (i) => i.statut === "CONFIRMEE",
  );
  const sessionsPresent = inscriptions.filter((i) => i.present === true).length;
  const sessionsAbsent = inscriptions.filter((i) => i.present === false).length;
  const tauxPresence =
    inscriptionsConfirmees.length > 0
      ? Math.round((sessionsPresent / inscriptionsConfirmees.length) * 100)
      : null;

  const nbReussis = resultats.filter((r) => r.reussi).length;
  const tauxReussite =
    resultats.length > 0
      ? Math.round((nbReussis / resultats.length) * 100)
      : null;
  const moyenneNotes =
    resultats.length > 0
      ? (
          resultats.reduce((acc, r) => acc + r.noteObtenue, 0) /
          resultats.length
        ).toFixed(1)
      : null;

  return (
    <div className="flex flex-col gap-8">
      {/* En-tête candidat */}
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg font-semibold">
            {candidat.prenom[0]}
            {candidat.nom[0]}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-semibold">
            {candidat.prenom} {candidat.nom}
          </h1>
          <p className="text-sm text-neutral-500">{candidat.email}</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            Inscrit le{" "}
            {new Date(candidat.dateCreation).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      {/* ── Cartes analytiques ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1 p-4 bg-neutral-50 rounded-xl">
          <p className="text-2xl font-bold">{inscriptions.length}</p>
          <p className="text-xs text-neutral-500">Inscriptions totales</p>
        </div>
        <div className="flex flex-col gap-1 p-4 bg-green-50 rounded-xl">
          <p className="text-2xl font-bold text-green-600">
            {tauxPresence !== null ? `${tauxPresence}%` : "—"}
          </p>
          <p className="text-xs text-neutral-500">
            Taux de présence
            {inscriptionsConfirmees.length > 0 && (
              <span className="text-neutral-400">
                {" "}
                ({sessionsPresent} présent / {sessionsAbsent} absent)
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col gap-1 p-4 bg-blue-50 rounded-xl">
          <p className="text-2xl font-bold text-blue-600">{resultats.length}</p>
          <p className="text-xs text-neutral-500">Évaluations passées</p>
        </div>
        <div className="flex flex-col gap-1 p-4 bg-violet-50 rounded-xl">
          <p className="text-2xl font-bold text-violet-600">
            {tauxReussite !== null ? `${tauxReussite}%` : "—"}
          </p>
          <p className="text-xs text-neutral-500">
            Taux de réussite
            {moyenneNotes && (
              <span className="text-neutral-400"> (moy. {moyenneNotes})</span>
            )}
          </p>
        </div>
      </div>

      {/* ── Onglets ──────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl w-fit">
        {(
          [
            {
              key: "inscriptions",
              label: `Sessions (${inscriptions.length})`,
            },
            {
              key: "evaluations",
              label: `Évaluations (${resultats.length})`,
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

      {/* ── Onglet Sessions ──────────────────────────────────────────────────── */}
      {onglet === "inscriptions" && (
        <div className="flex flex-col gap-3">
          {inscriptions.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-sm">Aucune inscription.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-neutral-500">
                  <th className="pb-3 font-medium">Session</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Statut inscription</th>
                  <th className="pb-3 font-medium">Présence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {inscriptions
                  .sort(
                    (a, b) =>
                      new Date(b.dateInscription).getTime() -
                      new Date(a.dateInscription).getTime(),
                  )
                  .map((i) => (
                    <tr key={i.id}>
                      <td className="py-3 font-medium">
                        {i.session?.cours?.titre ?? "—"}
                      </td>
                      <td className="py-3 text-neutral-500">
                        {new Date(i.session?.dateDebut).toLocaleDateString(
                          "fr-FR",
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            STATUT_INSCRIPTION_STYLES[i.statut]
                          }`}
                        >
                          {STATUT_INSCRIPTION_LABELS[i.statut]}
                        </span>
                      </td>
                      <td className="py-3">
                        {i.present === null ? (
                          <span className="text-xs text-neutral-400">—</span>
                        ) : i.present ? (
                          <span className="text-xs font-medium text-green-600">
                            ✓ Présent
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-red-500">
                            ✗ Absent
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Onglet Évaluations ───────────────────────────────────────────────── */}
      {onglet === "evaluations" && (
        <div className="flex flex-col gap-3">
          {resultats.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p className="text-3xl mb-2">📝</p>
              <p className="text-sm">Aucune évaluation passée.</p>
            </div>
          ) : (
            <>
              {/* Graphique simple taux réussite */}
              {resultats.length >= 2 && (
                <div className="flex flex-col gap-2 p-4 bg-neutral-50 rounded-xl mb-2">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Progression
                  </p>
                  <div className="flex flex-col gap-2">
                    {resultats
                      .sort(
                        (a, b) =>
                          new Date(a.dateSoumission).getTime() -
                          new Date(b.dateSoumission).getTime(),
                      )
                      .map((r) => {
                        const pct = Math.round(
                          (r.noteObtenue / r.evaluation?.noteMaximale) * 100,
                        );
                        return (
                          <div key={r.id} className="flex items-center gap-3">
                            <span className="text-xs text-neutral-400 w-24 flex-shrink-0 truncate">
                              {r.evaluation?.titre}
                            </span>
                            <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  r.reussi ? "bg-green-500" : "bg-red-400"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-10 text-right flex-shrink-0">
                              {pct}%
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-neutral-500">
                    <th className="pb-3 font-medium">Évaluation</th>
                    <th className="pb-3 font-medium">Domaine</th>
                    <th className="pb-3 font-medium">Note</th>
                    <th className="pb-3 font-medium">Résultat</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {resultats
                    .sort(
                      (a, b) =>
                        new Date(b.dateSoumission).getTime() -
                        new Date(a.dateSoumission).getTime(),
                    )
                    .map((r) => (
                      <tr key={r.id}>
                        <td className="py-3 font-medium">
                          {r.evaluation?.titre}
                        </td>
                        <td className="py-3 text-neutral-500">
                          {r.evaluation?.domaine?.nom ?? "—"}
                        </td>
                        <td className="py-3">
                          <span className="font-semibold">{r.noteObtenue}</span>
                          <span className="text-neutral-400">
                            {" "}
                            / {r.evaluation?.noteMaximale}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              r.reussi
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {r.reussi ? "Réussi" : "Échoué"}
                          </span>
                        </td>
                        <td className="py-3 text-neutral-500">
                          {new Date(r.dateSoumission).toLocaleDateString(
                            "fr-FR",
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}
