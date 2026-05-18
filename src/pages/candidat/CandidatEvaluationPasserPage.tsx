import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { candidatService } from "../../services/candidat.service";
import type { SoumissionEvaluationRequest } from "../../types/requests.types";

export default function CandidatEvaluationPasserPage() {
  const { id } = useParams<{ id: string }>();
  const evalId = Number(id);
  const navigate = useNavigate();

  const [reponsesQcm, setReponsesQcm] = useState<Record<number, number>>({});
  const [reponsesLibres, setReponsesLibres] = useState<Record<number, string>>(
    {},
  );
  const [tempsRestant, setTempsRestant] = useState<number | null>(null);
  const [dejaDepose, setDejaDepose] = useState(false);

  const { data: evaluation, isLoading } = useQuery({
    queryKey: ["candidat-evaluation", evalId],
    queryFn: () => candidatService.getEvaluationById(evalId),
  });

  // Timer
  useEffect(() => {
    if (!evaluation) return;
    setTempsRestant(evaluation.dureeMinutes * 60);
  }, [evaluation]);

  useEffect(() => {
    if (tempsRestant === null) return;
    if (tempsRestant <= 0) {
      handleSoumettre();
      return;
    }
    const interval = setInterval(() => {
      setTempsRestant((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [tempsRestant]);

  const soumettreM = useMutation({
    mutationFn: (data: SoumissionEvaluationRequest) =>
      candidatService.soumettre(evalId, data),
    onSuccess: (resultat) => {
      setDejaDepose(true);
      toast.success(
        resultat.reussi
          ? `Évaluation réussie ! Note : ${resultat.noteObtenue}/${evaluation?.noteMaximale}`
          : `Évaluation terminée. Note : ${resultat.noteObtenue}/${evaluation?.noteMaximale}`,
      );
      setTimeout(() => navigate("/candidat/evaluations"), 3000);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSoumettre = () => {
    if (dejaDepose) return;
    soumettreM.mutate({ reponsesQcm, reponsesLibres });
  };

  const formatTemps = (secondes: number) => {
    const m = Math.floor(secondes / 60);
    const s = secondes % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progression = evaluation
    ? Math.round(
        ((Object.keys(reponsesQcm).length +
          Object.keys(reponsesLibres).length) /
          (evaluation.questions?.length || 1)) *
          100,
      )
    : 0;

  if (isLoading)
    return <p className="text-sm text-neutral-500">Chargement...</p>;
  if (!evaluation)
    return <p className="text-sm text-red-500">Évaluation introuvable</p>;

  if (dejaDepose) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <p className="text-5xl">🎉</p>
        <div className="text-center">
          <p className="text-lg font-semibold">Évaluation soumise !</p>
          <p className="text-sm text-neutral-500 mt-1">
            Redirection vers vos résultats...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* En-tête sticky */}
      <div className="sticky top-14 z-30 bg-neutral-50 py-4 border-b border-neutral-100">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-base font-semibold">{evaluation.titre}</h1>
            <p className="text-xs text-neutral-500">
              {evaluation.questions?.length} question(s) · {progression}%
              répondu(s)
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            {tempsRestant !== null && (
              <span
                className={`text-sm font-mono font-semibold px-3 py-1.5 rounded-lg ${
                  tempsRestant < 300
                    ? "bg-red-100 text-red-600"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                ⏱ {formatTemps(tempsRestant)}
              </span>
            )}

            <button
              onClick={handleSoumettre}
              disabled={soumettreM.isPending}
              className="text-sm px-4 py-2 bg-neutral-900 text-white rounded-xl disabled:opacity-50 transition-colors"
            >
              {soumettreM.isPending ? "Soumission..." : "Soumettre"}
            </button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-3 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 rounded-full transition-all"
            style={{ width: `${progression}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-6 pb-20">
        {evaluation.questions
          ?.sort((a, b) => a.ordre - b.ordre)
          .map((q, index) => (
            <div
              key={q.id}
              className="flex flex-col gap-4 p-5 bg-white border border-neutral-100 rounded-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium">
                  <span className="text-neutral-400 mr-2">{index + 1}.</span>
                  {q.enonce}
                </p>
                <span className="text-xs text-neutral-400 whitespace-nowrap">
                  {q.points} pt(s)
                </span>
              </div>

              {/* QCM ou VRAI_FAUX */}
              {(q.type === "QCM" || q.type === "VRAI_FAUX") && (
                <div className="flex flex-col gap-2">
                  {q.choix?.map((choix) => (
                    <button
                      key={choix.id}
                      onClick={() =>
                        setReponsesQcm((prev) => ({
                          ...prev,
                          [q.id]: choix.id,
                        }))
                      }
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${
                        reponsesQcm[q.id] === choix.id
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          reponsesQcm[q.id] === choix.id
                            ? "border-white bg-white"
                            : "border-neutral-300"
                        }`}
                      />
                      {choix.texte}
                    </button>
                  ))}
                </div>
              )}

              {/* Réponse libre */}
              {q.type === "REPONSE_LIBRE" && (
                <textarea
                  value={reponsesLibres[q.id] ?? ""}
                  onChange={(e) =>
                    setReponsesLibres((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Votre réponse..."
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
                />
              )}
            </div>
          ))}
      </div>

      {/* Bouton soumettre bas de page */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <button
          onClick={handleSoumettre}
          disabled={soumettreM.isPending}
          className="px-8 py-3 bg-neutral-900 text-white text-sm font-medium rounded-2xl shadow-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
        >
          {soumettreM.isPending
            ? "Soumission en cours..."
            : "Soumettre l'évaluation"}
        </button>
      </div>
    </div>
  );
}
