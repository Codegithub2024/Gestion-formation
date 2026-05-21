// pages/admin/evaluations/EvaluationDetailPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDialogStore } from "../../../store/dialog.store";
import { evaluationService } from "../../../services/evaluation.service";
import { domaineService } from "../../../services/domaine.service";
import { sessionService } from "../../../services/session.service";
import EvaluationForm from "../../../components/admin/evaluations/EvaluationForm";
import QuestionForm from "../../../components/admin/evaluations/QuestionForm";
import ChoixReponseForm from "../../../components/admin/evaluations/ChoixReponseForm";
import ChangerStatutEvaluationForm from "../../../components/admin/evaluations/ChangerStatutEvaluationForm";
import ResultatDetailDialog from "../../../components/admin/evaluations/ResultatDetailDialog";
import ConfirmSuppression from "../../../components/ui/ConfirmSuppression";
import type {
  Question,
  ResultatEvaluation,
} from "../../../types/evaluation.types";
import type {
  UpdateEvaluationRequest,
  CreateQuestionRequest,
  CreateChoixReponseRequest,
} from "../../../types/requests.types";
import type { StatutEvaluation } from "../../../types/enums.types";
import QuestionCard from "../../../components/admin/evaluations/QuestionCard";

type OngletDetail = "questions" | "resultats";

export default function EvaluationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const evalId = Number(id);
  const navigate = useNavigate();
  const { open, close } = useDialogStore();
  const queryClient = useQueryClient();
  const [onglet, setOnglet] = useState<OngletDetail>("questions");

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: evaluation, isLoading } = useQuery({
    queryKey: ["evaluations", evalId],
    queryFn: () => evaluationService.getById(evalId),
  });

  const { data: resultats = [] } = useQuery({
    queryKey: ["evaluations-resultats", evalId],
    queryFn: () => evaluationService.getResultats(evalId),
    enabled: onglet === "resultats",
  });

  const { data: domaines = [] } = useQuery({
    queryKey: ["domaines"],
    queryFn: domaineService.getAll,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionService.getAll,
  });

  // ── Mutations évaluation ──────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (data: UpdateEvaluationRequest) =>
      evaluationService.update(evalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations", evalId] });
      toast.success("Évaluation modifiée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const changerStatutMutation = useMutation({
    mutationFn: (statut: StatutEvaluation) =>
      evaluationService.changerStatut(evalId, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations", evalId] });
      toast.success("Statut mis à jour");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Mutations questions ───────────────────────────────────────────────────
  const ajouterQuestionMutation = useMutation({
    mutationFn: (data: CreateQuestionRequest) =>
      evaluationService.ajouterQuestion(evalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations", evalId] });
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
      data: CreateQuestionRequest;
    }) => evaluationService.updateQuestion(evalId, questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations", evalId] });
      toast.success("Question modifiée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: number) =>
      evaluationService.deleteQuestion(evalId, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations", evalId] });
      toast.success("Question supprimée");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Mutations choix ───────────────────────────────────────────────────────
  const ajouterChoixMutation = useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: number;
      data: CreateChoixReponseRequest;
    }) => evaluationService.ajouterChoix(evalId, questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations", evalId] });
      toast.success("Choix ajouté");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateChoixMutation = useMutation({
    mutationFn: ({
      questionId,
      choixId,
      data,
    }: {
      questionId: number;
      choixId: number;
      data: CreateChoixReponseRequest;
    }) => evaluationService.updateChoix(evalId, questionId, choixId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations", evalId] });
      toast.success("Choix modifié");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteChoixMutation = useMutation({
    mutationFn: ({
      questionId,
      choixId,
    }: {
      questionId: number;
      choixId: number;
    }) => evaluationService.deleteChoix(evalId, questionId, choixId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations", evalId] });
      toast.success("Choix supprimé");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleModifier = () => {
    if (!evaluation) return;
    open(
      "Modifier l'évaluation",
      <EvaluationForm
        evaluation={evaluation}
        domaines={domaines}
        sessions={sessions}
        onSubmit={(data) =>
          updateMutation.mutate(data as UpdateEvaluationRequest)
        }
        isLoading={updateMutation.isPending}
      />,
    );
  };

  const handleChangerStatut = () => {
    if (!evaluation) return;
    open(
      "Changer le statut",
      <ChangerStatutEvaluationForm
        statutActuel={evaluation.statut}
        onSubmit={(statut) => changerStatutMutation.mutate(statut)}
        isLoading={changerStatutMutation.isPending}
      />,
    );
  };

  const handleAjouterQuestion = () => {
    open(
      "Nouvelle question",
      <QuestionForm
        question={null}
        onSubmit={(data) => ajouterQuestionMutation.mutate(data)}
        isLoading={ajouterQuestionMutation.isPending}
      />,
    );
  };

  const handleEditerQuestion = (question: Question) => {
    open(
      "Modifier la question",
      <QuestionForm
        question={question}
        onSubmit={(data) =>
          updateQuestionMutation.mutate({
            questionId: question.id,
            data,
          })
        }
        isLoading={updateQuestionMutation.isPending}
      />,
    );
  };

  const handleSupprimerQuestion = (question: Question) => {
    open(
      "Supprimer la question",
      <ConfirmSuppression
        message={`Supprimer la question "${question.enonce.slice(0, 60)}..." ?`}
        detail="Les choix de réponse associés seront également supprimés."
        isLoading={deleteQuestionMutation.isPending}
        onConfirm={() => deleteQuestionMutation.mutate(question.id)}
        onAnnuler={close}
      />,
    );
  };

  const handleAjouterChoix = (question: Question) => {
    open(
      "Ajouter un choix",
      <ChoixReponseForm
        choix={null}
        onSubmit={(data) =>
          ajouterChoixMutation.mutate({ questionId: question.id, data })
        }
        isLoading={ajouterChoixMutation.isPending}
      />,
    );
  };

  const handleEditerChoix = (
    question: Question,
    choix: { id: number; texte: string; estCorrect: boolean },
  ) => {
    open(
      "Modifier le choix",
      <ChoixReponseForm
        choix={choix}
        onSubmit={(data) =>
          updateChoixMutation.mutate({
            questionId: question.id,
            choixId: choix.id,
            data,
          })
        }
        isLoading={updateChoixMutation.isPending}
      />,
    );
  };

  const handleSupprimerChoix = (question: Question, choixId: number) => {
    open(
      "Supprimer le choix",
      <ConfirmSuppression
        message="Supprimer ce choix de réponse ?"
        isLoading={deleteChoixMutation.isPending}
        onConfirm={() =>
          deleteChoixMutation.mutate({ questionId: question.id, choixId })
        }
        onAnnuler={close}
      />,
    );
  };

  const handleVoirResultat = (resultat: ResultatEvaluation) => {
    open(
      `Résultat — ${resultat.utilisateur.prenom} ${resultat.utilisateur.nom}`,
      <ResultatDetailDialog resultat={resultat} evaluation={evaluation!} />,
    );
  };

  // ── Stats résultats ───────────────────────────────────────────────────────
  const nbReussis = resultats.filter((r) => r.reussi).length;
  const moyenne =
    resultats.length > 0
      ? (
          resultats.reduce((acc, r) => acc + r.noteObtenue, 0) /
          resultats.length
        ).toFixed(1)
      : null;

  if (isLoading)
    return <p className="p-6 text-sm text-neutral-500">Chargement...</p>;
  if (!evaluation)
    return <p className="p-6 text-sm text-red-500">Évaluation introuvable</p>;

  const peutModifier = evaluation.statut === "PLANIFIEE";

  return (
    <div className="flex flex-col gap-8">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{evaluation.titre}</h1>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                evaluation.statut === "EN_COURS"
                  ? "bg-green-100 text-green-700"
                  : evaluation.statut === "PLANIFIEE"
                    ? "bg-blue-100 text-blue-700"
                    : evaluation.statut === "TERMINEE"
                      ? "bg-neutral-100 text-neutral-600"
                      : "bg-red-100 text-red-600"
              }`}
            >
              {STATUT_LABELS[evaluation.statut]}
            </span>
          </div>
          <p className="text-sm text-neutral-500">{evaluation.domaine?.nom}</p>
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            label: "Début",
            value: new Date(evaluation.dateDebut).toLocaleString("fr-FR"),
          },
          {
            label: "Fin",
            value: new Date(evaluation.dateFin).toLocaleString("fr-FR"),
          },
          { label: "Durée", value: `${evaluation.dureeMinutes} min` },
          { label: "Note max", value: `${evaluation.noteMaximale} pts` },
          {
            label: "Seuil réussite",
            value: `${evaluation.seuilReussite} pts`,
          },
        ].map((info) => (
          <div
            key={info.label}
            className="flex flex-col gap-1 p-3 bg-white border border-neutral-200 rounded-xl"
          >
            <p className="text-xs text-neutral-500">{info.label}</p>
            <p className="text-sm font-medium">{info.value}</p>
          </div>
        ))}
      </div>

      {/* Session liée */}
      {evaluation.session && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-500">Session liée :</span>
          <span className="font-medium">{evaluation.session.cours?.titre}</span>
          <span className="text-neutral-400 text-xs">
            (
            {new Date(evaluation.session.dateDebut).toLocaleDateString("fr-FR")}
            )
          </span>
        </div>
      )}

      {/* Onglets */}
      <div className="flex bg-black/5 ring-1 ring-black/10 rounded-xl overflow-hidden w-fit">
        {(
          [
            {
              key: "questions",
              label: `Questions (${evaluation.questions?.length ?? 0})`,
            },
            {
              key: "resultats",
              label: `Résultats (${resultats.length})`,
            },
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
          {peutModifier && (
            <div className="flex justify-end">
              <button
                onClick={handleAjouterQuestion}
                className="text-sm px-4 py-2 bg-neutral-900 text-white rounded-lg"
              >
                + Ajouter une question
              </button>
            </div>
          )}

          {!evaluation.questions || evaluation.questions.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p className="text-3xl mb-2">❓</p>
              <p className="text-sm">Aucune question ajoutée.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {[...evaluation.questions]
                .sort((a, b) => a.ordre - b.ordre)
                .map((q, index) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={index}
                    peutModifier={peutModifier}
                    onEditer={() => handleEditerQuestion(q)}
                    onSupprimer={() => handleSupprimerQuestion(q)}
                    onAjouterChoix={() => handleAjouterChoix(q)}
                    onEditerChoix={(choix) => handleEditerChoix(q, choix)}
                    onSupprimerChoix={(choixId) =>
                      handleSupprimerChoix(q, choixId)
                    }
                  />
                ))}
            </div>
          )}

          {/* Total des points */}
          {evaluation.questions && evaluation.questions.length > 0 && (
            <div className="flex justify-end pt-2 border-t border-neutral-100">
              <p className="text-sm text-neutral-500">
                Total des points :{" "}
                <span className="font-semibold text-neutral-900">
                  {evaluation.questions.reduce((acc, q) => acc + q.points, 0)} /{" "}
                  {evaluation.noteMaximale}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Onglet Résultats ─────────────────────────────────────────────── */}
      {onglet === "resultats" && (
        <div className="flex flex-col gap-4">
          {resultats.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-50 rounded-xl text-center">
                <p className="text-2xl font-bold">{resultats.length}</p>
                <p className="text-xs text-neutral-500 mt-1">Candidats</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-green-600">
                  {nbReussis}
                  <span className="text-sm font-normal text-neutral-400 ml-1">
                    ({Math.round((nbReussis / resultats.length) * 100)}%)
                  </span>
                </p>
                <p className="text-xs text-neutral-500 mt-1">Réussis</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {moyenne ?? "—"}
                </p>
                <p className="text-xs text-neutral-500 mt-1">Moyenne</p>
              </div>
            </div>
          )}

          {resultats.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <p className="text-3xl mb-2">📊</p>
              <p className="text-sm">Aucun résultat pour cette évaluation.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-neutral-500">
                  <th className="pb-3 font-medium">Candidat</th>
                  <th className="pb-3 font-medium">Note</th>
                  <th className="pb-3 font-medium">Résultat</th>
                  <th className="pb-3 font-medium">Soumis le</th>
                  <th className="pb-3 font-medium text-right">Détail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {[...resultats]
                  .sort((a, b) => b.noteObtenue - a.noteObtenue)
                  .map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 font-medium">
                        {r.utilisateur.prenom} {r.utilisateur.nom}
                      </td>
                      <td className="py-3">
                        <span className="font-semibold">{r.noteObtenue}</span>
                        <span className="text-neutral-400">
                          {" "}
                          / {evaluation.noteMaximale}
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
                        {new Date(r.dateSoumission).toLocaleString("fr-FR")}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleVoirResultat(r)}
                          className="text-xs px-3 py-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                        >
                          Voir détail
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

const STATUT_LABELS: Record<string, string> = {
  PLANIFIEE: "Planifiée",
  EN_COURS: "En cours",
  TERMINEE: "Terminée",
  ANNULEE: "Annulée",
};
