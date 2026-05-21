// pages/admin/sessions/SessionDetailPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDialogStore } from "../../../store/dialog.store";
import { sessionService } from "../../../services/session.service";
import { formateurService } from "../../../services/formateur.service";
import { coursService } from "../../../services/cours.service";
import SessionForm from "../../../components/admin/sessions/SessionForm";
import AssignerFormateurForm from "../../../components/admin/sessions/AssignerFormateurForm";
import ChangerStatutForm from "../../../components/admin/sessions/ChangerStatutForm";
import InscriptionTable from "../../../components/admin/sessions/InscriptionTable";
import PresencesForm from "../../../components/admin/sessions/PresencesForm";
import ConfirmSuppression from "../../../components/ui/ConfirmSuppression";
import { convocationService } from "../../../services/convocation.service";
import ConvocationList from "../../../components/admin/sondages/ConvocationList";

import type {
  UpdateSessionRequest,
  EnregistrerPresencesRequest,
} from "../../../types/requests.types";
import type { StatutInscription } from "../../../types/enums.types";

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sessionId = Number(id);
  const navigate = useNavigate();
  const { open, close } = useDialogStore();
  const queryClient = useQueryClient();

  // Filtre actif sur les inscriptions
  const [filtreInscription, setFiltreInscription] = useState<
    StatutInscription | "TOUS" | "convocations" | "convocations-candidats"
  >("TOUS");

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: session, isLoading: loadingSession } = useQuery({
    queryKey: ["sessions", sessionId],
    queryFn: () => sessionService.getById(sessionId),
  });

  const { data: inscriptions = [], isLoading: loadingInscriptions } = useQuery({
    queryKey: ["inscriptions", sessionId],
    queryFn: () => sessionService.getInscriptions(sessionId),
  });

  const { data: cours = [] } = useQuery({
    queryKey: ["cours"],
    queryFn: coursService.getAll,
  });

  const { data: formateursInternes = [] } = useQuery({
    queryKey: ["formateurs-internes"],
    queryFn: formateurService.getAllInternes,
  });

  const { data: formateursExternes = [] } = useQuery({
    queryKey: ["formateurs-externes"],
    queryFn: formateurService.getAllExternes,
  });

  const { data: convocations = [], refetch: refetchConvocations } = useQuery({
    queryKey: ["convocations", sessionId],
    queryFn: () => convocationService.getBySession(sessionId),
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (data: UpdateSessionRequest) =>
      sessionService.update(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", sessionId] });
      toast.success("Session modifiée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const changerStatutMutation = useMutation({
    mutationFn: (statut: string) =>
      sessionService.changerStatut(sessionId, statut as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", sessionId] });
      toast.success("Statut mis à jour");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const assignerInterneMutation = useMutation({
    mutationFn: (formateurId: number) =>
      sessionService.assignerFormateurInterne(sessionId, formateurId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", sessionId] });
      toast.success("Formateur interne assigné");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const assignerExterneMutation = useMutation({
    mutationFn: (formateurId: number) =>
      sessionService.assignerFormateurExterne(sessionId, formateurId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", sessionId] });
      toast.success("Formateur externe assigné");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const retirerFormateurMutation = useMutation({
    mutationFn: () => sessionService.retirerFormateur(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", sessionId] });
      toast.success("Formateur retiré");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const confirmerMutation = useMutation({
    mutationFn: (inscriptionId: number) =>
      sessionService.confirmerInscription(inscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inscriptions", sessionId] });
      toast.success("Inscription confirmée");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const annulerMutation = useMutation({
    mutationFn: (inscriptionId: number) =>
      sessionService.annulerInscription(inscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inscriptions", sessionId] });
      toast.success("Inscription annulée");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const presencesMutation = useMutation({
    mutationFn: (presences: EnregistrerPresencesRequest) =>
      sessionService.enregistrerPresences(sessionId, presences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inscriptions", sessionId] });
      toast.success("Présences enregistrées");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const envoyerCandidatsMutation = useMutation({
    mutationFn: () => convocationService.envoyerCandidats(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["convocations", sessionId] });
      toast.success("Convocations envoyées aux candidats");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const envoyerFormateurMutation = useMutation({
    mutationFn: () => convocationService.envoyerFormateur(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["convocations", sessionId] });
      toast.success("Convocation envoyée au formateur");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleModifier = () => {
    if (!session) return;
    open(
      "Modifier la session",
      <SessionForm
        session={session}
        cours={cours}
        formateursInternes={formateursInternes}
        formateursExternes={formateursExternes}
        onSubmit={(data) => updateMutation.mutate(data as UpdateSessionRequest)}
        isLoading={updateMutation.isPending}
      />,
    );
  };

  const handleChangerStatut = () => {
    if (!session) return;
    open(
      "Changer le statut",
      <ChangerStatutForm
        statutActuel={session.statut}
        onSubmit={(statut) => changerStatutMutation.mutate(statut)}
        isLoading={changerStatutMutation.isPending}
      />,
    );
  };

  const handleAssignerFormateur = () => {
    if (!session) return;
    // Filtre les formateurs qui peuvent enseigner ce cours
    const internesFiltres = formateursInternes.filter((f) =>
      f.coursEnseignables.some((c) => c.id === session.cours?.id),
    );
    const externesFiltres = formateursExternes.filter((f) =>
      f.coursEnseignables.some((c) => c.id === session.cours?.id),
    );
    open(
      "Assigner un formateur",
      <AssignerFormateurForm
        formateursInternes={internesFiltres}
        formateursExternes={externesFiltres}
        onAssignerInterne={(id) => assignerInterneMutation.mutate(id)}
        onAssignerExterne={(id) => assignerExterneMutation.mutate(id)}
        isLoading={
          assignerInterneMutation.isPending || assignerExterneMutation.isPending
        }
      />,
    );
  };

  const handleRetirerFormateur = () => {
    open(
      "Retirer le formateur",
      <ConfirmSuppression
        message="Retirer le formateur de cette session ?"
        isLoading={retirerFormateurMutation.isPending}
        onConfirm={() => retirerFormateurMutation.mutate()}
        onAnnuler={close}
      />,
    );
  };

  const handleEnregistrerPresences = () => {
    const inscriptionsConfirmees = inscriptions.filter(
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

  const handleEnvoyerConvocationsCandidats = () => {
    const inscritesConfirmees = inscriptions.filter(
      (i) => i.statut === "CONFIRMEE",
    );
    open(
      "Envoyer les convocations",
      <ConfirmSuppression
        message={`Envoyer une convocation aux ${inscritesConfirmees.length} candidat(s) confirmé(s) ?`}
        isLoading={envoyerCandidatsMutation.isPending}
        onConfirm={() => envoyerCandidatsMutation.mutate()}
        onAnnuler={close}
      />,
    );
  };

  const handleEnvoyerConvocationFormateur = () => {
    open(
      "Convoquer le formateur",
      <ConfirmSuppression
        message={`Envoyer la convocation à ${formateurNom} ?`}
        isLoading={envoyerFormateurMutation.isPending}
        onConfirm={() => envoyerFormateurMutation.mutate()}
        onAnnuler={close}
      />,
    );
  };

  // ── Inscriptions filtrées ─────────────────────────────────────────────────
  const inscriptionsFiltrees =
    filtreInscription === "TOUS"
      ? inscriptions
      : inscriptions.filter((i) => i.statut === filtreInscription);

  // Compteurs par statut
  const comptes = {
    EN_ATTENTE: inscriptions.filter((i) => i.statut === "EN_ATTENTE").length,
    CONFIRMEE: inscriptions.filter((i) => i.statut === "CONFIRMEE").length,
    LISTE_ATTENTE: inscriptions.filter((i) => i.statut === "LISTE_ATTENTE")
      .length,
    ANNULEE: inscriptions.filter((i) => i.statut === "ANNULEE").length,
  };

  if (loadingSession)
    return <p className="p-6 text-sm text-neutral-500">Chargement...</p>;
  if (!session)
    return <p className="p-6 text-sm text-red-500">Session introuvable</p>;

  const formateurNom = session.formateurInterne
    ? `${session.formateurInterne.utilisateur.prenom} ${session.formateurInterne.utilisateur.nom}`
    : session.formateurExterne
      ? `${session.formateurExterne.prenom} ${session.formateurExterne.nom} (Externe)`
      : null;

  return (
    <div className="flex flex-col gap-8">
      {/* ── Informations de la session ──────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">{session.cours?.titre}</h1>
              <StatutBadge statut={session.statut} />
            </div>
            <p className="text-sm text-neutral-500">
              {session.cours?.domaine?.nom}
            </p>
          </div>

          {/* Actions principales */}
          <div className="flex gap-2">
            {session.statut !== "ANNULEE" && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleEnvoyerConvocationsCandidats}
                  disabled={comptes.CONFIRMEE === 0}
                  className="text-sm px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                >
                  📧 Convoquer les candidats ({comptes.CONFIRMEE})
                </button>
              </div>
            )}
            <button
              onClick={handleModifier}
              className="text-sm px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Modifier
            </button>
            <button
              onClick={handleChangerStatut}
              className="text-sm px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Changer statut
            </button>
            {session.statut === "TERMINEE" && (
              <button
                onClick={handleEnregistrerPresences}
                className="text-sm px-3 py-1.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Enregistrer présences
              </button>
            )}
          </div>
        </div>

        {/* Détails */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <InfoCard
            label="Date de début"
            value={new Date(session.dateDebut).toLocaleString("fr-FR")}
          />
          <InfoCard
            label="Date de fin"
            value={new Date(session.dateFin).toLocaleString("fr-FR")}
          />
          <InfoCard label="Lieu" value={session.lieu ?? "Non défini"} />
          <InfoCard
            label="Capacité"
            value={`${comptes.CONFIRMEE} / ${session.capacite} confirmé(s)`}
          />
        </div>

        {/* Formateur */}
        <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
          <div className="flex-1">
            <p className="text-xs text-neutral-500 mb-0.5">Formateur</p>
            <p className="text-sm font-medium">
              {formateurNom ?? (
                <span className="text-neutral-400 font-normal">
                  Non assigné
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAssignerFormateur}
              className="text-xs px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              {formateurNom ? "Changer" : "Assigner"}
            </button>
            {formateurNom && (
              <button
                onClick={handleRetirerFormateur}
                className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              >
                Retirer
              </button>
            )}
            {formateurNom && (
              <button
                onClick={handleEnvoyerConvocationFormateur}
                className="text-sm px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                📧 Convoquer le formateur
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Inscriptions ────────────────────────────────────────────────────── */}

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">
          Inscriptions ({inscriptions.length})
        </h2>

        {/* Onglets de filtre par statut */}
        <div className="flex overflow-hidden flex-wrap bg-black/5 w-fit ring ring-neutral-200 rounded-xl">
          {(
            [
              { key: "TOUS", label: "Tous", count: inscriptions.length },
              {
                key: "EN_ATTENTE",
                label: "En attente",
                count: comptes.EN_ATTENTE,
              },
              {
                key: "CONFIRMEE",
                label: "Confirmées",
                count: comptes.CONFIRMEE,
              },
              {
                key: "LISTE_ATTENTE",
                label: "Liste d'attente",
                count: comptes.LISTE_ATTENTE,
              },
              { key: "ANNULEE", label: "Annulées", count: comptes.ANNULEE },
              {
                key: "inscriptions",
                label: `Inscriptions (${inscriptions.length})`,
                count: inscriptions.length,
              },
              {
                key: "convocations",
                label: `Convocations (${convocations.length})`,
                count: convocations.length,
              },
            ] as const
          ).map((filtre) => (
            <button
              key={filtre.key}
              onClick={() => setFiltreInscription(filtre.key as any)}
              className={`px-3 py-2 font-medium text-xs rounded transition-colors flex items-center gap-1 ${
                filtreInscription === filtre.key
                  ? "bg-white text-neutral-800"
                  : " text-neutral-600 hover:bg-black/5"
              }`}
            >
              {filtre.label}
              <span
                className={`text-xs px-1.5 py-0.5 leading-none rounded-full ${
                  filtreInscription === filtre.key
                    ? "bg-black/10"
                    : "bg-black/5"
                }`}
              >
                {filtre.count}
              </span>
            </button>
          ))}
        </div>

        {filtreInscription === "convocations" ? (
          <ConvocationList convocations={convocations} />
        ) : (
          <InscriptionTable
            inscriptions={inscriptionsFiltrees}
            isLoading={loadingInscriptions}
            sessionStatut={session.statut}
            onConfirmer={(id) => confirmerMutation.mutate(id)}
            onAnnuler={(id) => annulerMutation.mutate(id)}
            isConfirming={confirmerMutation.isPending}
            isAnnuling={annulerMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

// ── Composants locaux ─────────────────────────────────────────────────────────

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function StatutBadge({ statut }: { statut: string }) {
  const styles: Record<string, string> = {
    PLANIFIEE: "bg-blue-100 text-blue-700",
    EN_COURS: "bg-green-100 text-green-700",
    TERMINEE: "bg-neutral-100 text-neutral-600",
    ANNULEE: "bg-red-100 text-red-600",
  };
  const labels: Record<string, string> = {
    PLANIFIEE: "Planifiée",
    EN_COURS: "En cours",
    TERMINEE: "Terminée",
    ANNULEE: "Annulée",
  };
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[statut]}`}
    >
      {labels[statut] ?? statut}
    </span>
  );
}
