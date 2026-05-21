// pages/admin/sondages/SondageDetailPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDialogStore } from "../../../store/dialog.store";
import { sondageService } from "../../../services/sondage.service";
import { domaineService } from "../../../services/domaine.service";
import SondageForm from "../../../components/admin/sondages/SondageForm";
import QuestionSondageForm from "../../../components/admin/sondages/QuestionSondageForm";
import OptionSondageForm from "../../../components/admin/sondages/OptionSondageForm";
import ChangerStatutSondageForm from "../../../components/admin/sondages/ChangerStatutSondageForm";
import RapportSondageView from "../../../components/admin/sondages/RapportSondageView";
import ConfirmSuppression from "../../../components/ui/ConfirmSuppression";
import type { QuestionSondage } from "../../../types/sondage.types";
import type {
  UpdateSondageRequest,
  CreateQuestionSondageRequest,
  CreateOptionSondageRequest,
} from "../../../types/requests.types";
import type { StatutSondage } from "../../../types/enums.types";
import QuestionSondageCard from "../../../components/admin/sondages/QuestionSondageCard";
import Button from "../../../components/ui/Button";
import { CircleQuestionMarkIcon, Plus } from "lucide-react";

type OngletDetail = "questions" | "rapport";

const STATUT_LABELS: Record<string, string> = {
  PLANIFIE: "Planifié",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ANNULE: "Annulé",
};

const STATUT_STYLES: Record<string, string> = {
  PLANIFIE: "bg-[#FAB319] text-[#422400]",
  EN_COURS: "bg-green-100 text-green-700",
  TERMINE: "bg-neutral-100 text-neutral-600",
  ANNULE: "bg-red-100 text-red-600",
};

export default function SondageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sondageId = Number(id);
  const navigate = useNavigate();
  const { open, close } = useDialogStore();
  const queryClient = useQueryClient();
  const [onglet, setOnglet] = useState<OngletDetail>("questions");

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: sondage, isLoading } = useQuery({
    queryKey: ["sondages", sondageId],
    queryFn: () => sondageService.getById(sondageId),
  });

  const { data: rapport, isLoading: loadingRapport } = useQuery({
    queryKey: ["sondages-rapport", sondageId],
    queryFn: () => sondageService.getRapport(sondageId),
    enabled: onglet === "rapport",
  });

  const { data: domaines = [] } = useQuery({
    queryKey: ["domaines"],
    queryFn: domaineService.getAll,
  });

  // ── Mutations sondage ─────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (data: UpdateSondageRequest) =>
      sondageService.update(sondageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sondages", sondageId] });
      toast.success("Sondage modifié");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const changerStatutMutation = useMutation({
    mutationFn: (statut: StatutSondage) =>
      sondageService.changerStatut(sondageId, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sondages", sondageId] });
      toast.success("Statut mis à jour");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Mutations questions ───────────────────────────────────────────────────
  const ajouterQuestionMutation = useMutation({
    mutationFn: (data: CreateQuestionSondageRequest) =>
      sondageService.ajouterQuestion(sondageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sondages", sondageId] });
      toast.success("Question ajoutée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: number;
      data: CreateQuestionSondageRequest;
    }) => sondageService.updateQuestion(sondageId, questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sondages", sondageId] });
      toast.success("Question modifiée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: number) =>
      sondageService.deleteQuestion(sondageId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sondages", sondageId] });
      toast.success("Question supprimée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Mutations options ─────────────────────────────────────────────────────
  const ajouterOptionMutation = useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: number;
      data: CreateOptionSondageRequest;
    }) => sondageService.ajouterOption(sondageId, questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sondages", sondageId] });
      toast.success("Option ajoutée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateOptionMutation = useMutation({
    mutationFn: ({
      questionId,
      optionId,
      data,
    }: {
      questionId: number;
      optionId: number;
      data: CreateOptionSondageRequest;
    }) => sondageService.updateOption(sondageId, questionId, optionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sondages", sondageId] });
      toast.success("Option modifiée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteOptionMutation = useMutation({
    mutationFn: ({
      questionId,
      optionId,
    }: {
      questionId: number;
      optionId: number;
    }) => sondageService.deleteOption(sondageId, questionId, optionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sondages", sondageId] });
      toast.success("Option supprimée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleModifier = () => {
    if (!sondage) return;
    open(
      "Modifier le sondage",
      <SondageForm
        sondage={sondage}
        domaines={domaines}
        onSubmit={(data) => updateMutation.mutate(data as UpdateSondageRequest)}
        isLoading={updateMutation.isPending}
      />,
    );
  };

  const handleChangerStatut = () => {
    if (!sondage) return;
    open(
      "Changer le statut",
      <ChangerStatutSondageForm
        statutActuel={sondage.statut}
        onSubmit={(statut) => changerStatutMutation.mutate(statut)}
        isLoading={changerStatutMutation.isPending}
      />,
    );
  };

  const handleAjouterQuestion = () => {
    open(
      "Nouvelle question",
      <QuestionSondageForm
        question={null}
        onSubmit={(data) => ajouterQuestionMutation.mutate(data)}
        isLoading={ajouterQuestionMutation.isPending}
      />,
    );
  };

  const handleEditerQuestion = (question: QuestionSondage) => {
    open(
      "Modifier la question",
      <QuestionSondageForm
        question={question}
        onSubmit={(data) =>
          updateQuestionMutation.mutate({ questionId: question.id, data })
        }
        isLoading={updateQuestionMutation.isPending}
      />,
    );
  };

  const handleSupprimerQuestion = (question: QuestionSondage) => {
    open(
      "Supprimer la question",
      <ConfirmSuppression
        message={`Supprimer "${question.enonce.slice(0, 60)}..." ?`}
        detail="Les options associées seront également supprimées."
        isLoading={deleteQuestionMutation.isPending}
        onConfirm={() => deleteQuestionMutation.mutate(question.id)}
        onAnnuler={close}
      />,
    );
  };

  const handleAjouterOption = (question: QuestionSondage) => {
    open(
      "Ajouter une option",
      <OptionSondageForm
        option={null}
        onSubmit={(data) =>
          ajouterOptionMutation.mutate({ questionId: question.id, data })
        }
        isLoading={ajouterOptionMutation.isPending}
      />,
    );
  };

  const handleEditerOption = (
    question: QuestionSondage,
    option: { id: number; texte: string },
  ) => {
    open(
      "Modifier l'option",
      <OptionSondageForm
        option={option}
        onSubmit={(data) =>
          updateOptionMutation.mutate({
            questionId: question.id,
            optionId: option.id,
            data,
          })
        }
        isLoading={updateOptionMutation.isPending}
      />,
    );
  };

  const handleSupprimerOption = (
    question: QuestionSondage,
    optionId: number,
  ) => {
    open(
      "Supprimer l'option",
      <ConfirmSuppression
        message="Supprimer cette option ?"
        isLoading={deleteOptionMutation.isPending}
        onConfirm={() =>
          deleteOptionMutation.mutate({ questionId: question.id, optionId })
        }
        onAnnuler={close}
      />,
    );
  };

  if (isLoading)
    return <p className="p-6 text-sm text-neutral-500">Chargement...</p>;
  if (!sondage)
    return <p className="p-6 text-sm text-red-500">Sondage introuvable</p>;

  const peutModifier = sondage.statut === "PLANIFIE";

  return (
    <div className="flex flex-col gap-8">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold leading-0 capitalize">
              {sondage.titre}
            </h1>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold tracking-wide border border-black/30 ${
                STATUT_STYLES[sondage.statut]
              }`}
            >
              {STATUT_LABELS[sondage.statut]}
            </span>
            {sondage.anonyme && (
              <span className="text-xs font-bold bg-grid grid-size-2 grid-color-neutral-300 border border-black/20 text-neutral-800 px-2.5 py-1 rounded-full">
                🔒 Anonyme
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500">{sondage.domaine?.nom}</p>
          {sondage.description && (
            <p className="text-sm text-neutral-400 mt-1">
              {sondage.description}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {peutModifier && (
            <button
              onClick={handleModifier}
              className="text-sm px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Modifier
            </button>
          )}
          <button
            onClick={handleChangerStatut}
            className="text-sm px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Changer statut
          </button>
        </div>
      </div>

      {/* Infos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Début",
            value: new Date(sondage.dateDebut).toLocaleDateString("fr-FR"),
          },
          {
            label: "Fin",
            value: new Date(sondage.dateFin).toLocaleDateString("fr-FR"),
          },
          {
            label: "Questions",
            value: `${sondage.questions?.length ?? 0}`,
          },
          {
            label: "Anonymat",
            value: sondage.anonyme ? "Activé" : "Désactivé",
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

      {/* Onglets */}
      <div className="flex gap-1 overflow-y-auto bg-black/5 ring-1 ring-black/10 overflow-hidden rounded-xl w-fit">
        {(
          [
            {
              key: "questions",
              label: `Questions (${sondage.questions?.length ?? 0})`,
            },
            { key: "rapport", label: "Rapport des réponses" },
          ] as const
        ).map((o) => (
          <button
            key={o.key}
            onClick={() => setOnglet(o.key)}
            className={`px-4 py-2 text-sm rounded transition-all ${
              onglet === o.key
                ? "bg-white text-neutral-900 font-medium shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* ── Onglet Questions ──────────────────────────────────────────────── */}
      {onglet === "questions" && (
        <div className="flex flex-col gap-4">
          {!sondage.questions || sondage.questions.length === 0 ? (
            <button
              className="flex flex-col gap-2 justify-center items-center rounded-lg border-2 cursor-pointer bg-black/5 border-dashed border-black/10 px-4 py-10"
              onClick={handleAjouterQuestion}
            >
              <div className="flex flex-col gap-1 justify-center items-center text-neutral-500">
                <CircleQuestionMarkIcon size={48} strokeWidth={3} />
                <p className="font-medium text-sm">Aucune question ajoutée</p>
              </div>
              <p className="flex gap-2 items-center text-base font-semibold">
                <Plus size={16} className="stroke-3" /> Clickez pour ajouter une
                question
              </p>
            </button>
          ) : (
            <div className="grid lg:grid-cols-2 gap-4">
              {[...sondage.questions]
                .sort((a, b) => a.ordre - b.ordre)
                .map((q, index) => (
                  <QuestionSondageCard
                    key={q.id}
                    question={q}
                    index={index}
                    peutModifier={peutModifier}
                    onEditer={() => handleEditerQuestion(q)}
                    onSupprimer={() => handleSupprimerQuestion(q)}
                    onAjouterOption={() => handleAjouterOption(q)}
                    onEditerOption={(option) => handleEditerOption(q, option)}
                    onSupprimerOption={(optionId) =>
                      handleSupprimerOption(q, optionId)
                    }
                  />
                ))}
              {peutModifier && (
                <button
                  className="flex justify-center items-center rounded-lg border-2 bg cursor-pointer hover:bg-black/5 border-dashed border-black/10"
                  onClick={handleAjouterQuestion}
                >
                  <p>Ajouter une question</p>
                  <Plus size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Onglet Rapport ───────────────────────────────────────────────── */}
      {onglet === "rapport" && (
        <RapportSondageView
          rapport={rapport ?? null}
          isLoading={loadingRapport}
          sondage={sondage}
        />
      )}
    </div>
  );
}
