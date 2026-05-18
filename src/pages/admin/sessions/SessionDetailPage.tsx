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
    StatutInscription | "TOUS"
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
            value={`${comptes.CONFIRMEE} / ${session.capaciteMax} confirmé(s)`}
          />
        </div>

        {/* Formateur */}
        <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
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
          </div>
        </div>
      </div>

      {/* ── Inscriptions ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">
          Inscriptions ({inscriptions.length})
        </h2>

        {/* Onglets de filtre par statut */}
        <div className="flex gap-1 flex-wrap">
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
            ] as const
          ).map((filtre) => (
            <button
              key={filtre.key}
              onClick={() => setFiltreInscription(filtre.key as any)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 ${
                filtreInscription === filtre.key
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {filtre.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filtreInscription === filtre.key
                    ? "bg-white/20"
                    : "bg-neutral-200"
                }`}
              >
                {filtre.count}
              </span>
            </button>
          ))}
        </div>

        <InscriptionTable
          inscriptions={inscriptionsFiltrees}
          isLoading={loadingInscriptions}
          sessionStatut={session.statut}
          onConfirmer={(id) => confirmerMutation.mutate(id)}
          onAnnuler={(id) => annulerMutation.mutate(id)}
          isConfirming={confirmerMutation.isPending}
          isAnnuling={annulerMutation.isPending}
        />
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
