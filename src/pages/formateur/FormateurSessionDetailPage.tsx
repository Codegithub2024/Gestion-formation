// pages/formateur/FormateurSessionDetailPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDialogStore } from "../../store/dialog.store";
import { formateurProfilService } from "../../services/formateur.profil.service";
import PresencesForm from "../../components/admin/sessions/PresencesForm";
import type { StatutInscription } from "../../types/enums.types";
import type { EnregistrerPresencesRequest } from "../../types/requests.types";

const STATUT_INSCRIPTION_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  LISTE_ATTENTE: "Liste d'attente",
  ANNULEE: "Annulée",
};

const STATUT_INSCRIPTION_STYLES: Record<string, string> = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMEE: "bg-green-100 text-green-700",
  LISTE_ATTENTE: "bg-blue-100 text-blue-700",
  ANNULEE: "bg-red-100 text-red-600",
};

export default function FormateurSessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sessionId = Number(id);
  const navigate = useNavigate();
  const { open, close } = useDialogStore();
  const queryClient = useQueryClient();
  const [filtreInscription, setFiltreInscription] = useState<
    StatutInscription | "TOUS"
  >("TOUS");

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: session, isLoading: loadingSession } = useQuery({
    queryKey: ["formateur-session", sessionId],
    queryFn: () => formateurProfilService.getSessionById(sessionId),
  });

  const { data: inscrits = [], isLoading: loadingInscrits } = useQuery({
    queryKey: ["formateur-inscrits", sessionId],
    queryFn: () => formateurProfilService.getInscrits(sessionId),
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const presencesMutation = useMutation({
    mutationFn: (presences: EnregistrerPresencesRequest) =>
      formateurProfilService.enregistrerPresences(sessionId, presences),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["formateur-inscrits", sessionId],
      });
      toast.success("Présences enregistrées");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEnregistrerPresences = () => {
    const inscriptionsConfirmees = inscrits.filter(
      (i) => i.statut === "CONFIRMEE",
    );
    open(
      "Enregistrer les présences",
      <PresencesForm
        inscriptions={inscriptionsConfirmees}
        onSubmit={(presences) => presencesMutation.mutate(presences)}
        isLoading={presencesMutation.isPending}
      />,
    );
  };

  // ── Inscriptions filtrées ─────────────────────────────────────────────────
  const inscritsFiltres =
    filtreInscription === "TOUS"
      ? inscrits
      : inscrits.filter((i) => i.statut === filtreInscription);

  const comptes = {
    EN_ATTENTE: inscrits.filter((i) => i.statut === "EN_ATTENTE").length,
    CONFIRMEE: inscrits.filter((i) => i.statut === "CONFIRMEE").length,
    LISTE_ATTENTE: inscrits.filter((i) => i.statut === "LISTE_ATTENTE").length,
    ANNULEE: inscrits.filter((i) => i.statut === "ANNULEE").length,
  };

  if (loadingSession)
    return <p className="p-6 text-sm text-neutral-500">Chargement...</p>;
  if (!session)
    return <p className="p-6 text-sm text-red-500">Session introuvable</p>;

  const peutEnregistrerPresences =
    session.statut === "TERMINEE" &&
    inscrits.some((i) => i.statut === "CONFIRMEE");

  return (
    <div className="flex flex-col gap-8">
      {/* Retour */}
      <button
        onClick={() => navigate("/formateur/sessions")}
        className="text-sm text-neutral-500 hover:text-neutral-900 w-fit transition-colors"
      >
        ← Retour
      </button>

      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{session.cours?.titre}</h1>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                session.statut === "EN_COURS"
                  ? "bg-green-100 text-green-700"
                  : session.statut === "PLANIFIEE"
                    ? "bg-blue-100 text-blue-700"
                    : session.statut === "TERMINEE"
                      ? "bg-neutral-100 text-neutral-600"
                      : "bg-red-100 text-red-600"
              }`}
            >
              {session.statut === "EN_COURS"
                ? "En cours"
                : session.statut === "PLANIFIEE"
                  ? "Planifiée"
                  : session.statut === "TERMINEE"
                    ? "Terminée"
                    : "Annulée"}
            </span>
          </div>
          <p className="text-sm text-neutral-400">
            {session.cours?.domaine?.nom}
          </p>
        </div>

        {peutEnregistrerPresences && (
          <button
            onClick={handleEnregistrerPresences}
            className="bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Enregistrer les présences
          </button>
        )}
      </div>

      {/* Informations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Début",
            value: new Date(session.dateDebut).toLocaleString("fr-FR"),
          },
          {
            label: "Fin",
            value: new Date(session.dateFin).toLocaleString("fr-FR"),
          },
          { label: "Lieu", value: session.lieu ?? "Non défini" },
          {
            label: "Inscrits confirmés",
            value: `${comptes.CONFIRMEE} / ${session.capacite}`,
          },
        ].map((info) => (
          <div
            key={info.label}
            className="flex flex-col gap-1 p-3 bg-white border border-black/10 rounded-xl"
          >
            <p className="text-xs text-neutral-500">{info.label}</p>
            <p className="text-sm font-medium">{info.value}</p>
          </div>
        ))}
      </div>

      {/* Alerte présences */}
      {session.statut === "TERMINEE" &&
        inscrits.some(
          (i) => i.statut === "CONFIRMEE" && i.present === null,
        ) && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-amber-500 text-lg">⚠</span>
            <div>
              <p className="text-sm font-medium text-amber-700">
                Présences non enregistrées
              </p>
              <p className="text-xs text-amber-600">
                Cette session est terminée mais les présences n'ont pas encore
                été enregistrées.
              </p>
            </div>
          </div>
        )}

      {/* Section inscriptions */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">
          Participants ({inscrits.length})
        </h2>

        {/* Filtres */}
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { key: "TOUS", label: "Tous", count: inscrits.length },
              {
                key: "EN_ATTENTE",
                label: "En attente",
                count: comptes.EN_ATTENTE,
              },
              {
                key: "CONFIRMEE",
                label: "Confirmés",
                count: comptes.CONFIRMEE,
              },
              {
                key: "LISTE_ATTENTE",
                label: "Liste d'attente",
                count: comptes.LISTE_ATTENTE,
              },
            ] as const
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltreInscription(f.key as any)}
              className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 transition-colors ${
                filtreInscription === f.key
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {f.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filtreInscription === f.key ? "bg-white/20" : "bg-neutral-200"
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tableau participants */}
        {loadingInscrits ? (
          <p className="text-sm text-neutral-500">Chargement...</p>
        ) : inscritsFiltres.length === 0 ? (
          <p className="text-sm text-neutral-500">Aucun participant.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-neutral-500">
                <th className="pb-3 font-medium">Participant</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Inscription</th>
                <th className="pb-3 font-medium">Statut</th>
                {session.statut === "TERMINEE" && (
                  <th className="pb-3 font-medium">Présence</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {inscritsFiltres.map((i) => (
                <tr key={i.id}>
                  <td className="py-3 font-medium">
                    {i.utilisateur.prenom} {i.utilisateur.nom}
                  </td>
                  <td className="py-3 text-neutral-500">
                    {i.utilisateur.email}
                  </td>
                  <td className="py-3 text-neutral-500">
                    {new Date(i.dateInscription).toLocaleDateString("fr-FR")}
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
                  {session.statut === "TERMINEE" && (
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
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
