import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { candidatService } from "../../services/candidat.service";
import type { Sondage } from "../../types/sondage.types";
import type { SoumissionSondageRequest } from "../../types/requests.types";

export default function CandidatSondagesPage() {
  const queryClient = useQueryClient();
  const [sondageActif, setSondageActif] = useState<Sondage | null>(null);
  const [reponses, setReponses] = useState<
    Record<number, { optionId?: number; reponseLibre?: string }>
  >({});
  const [deposes, setDeposes] = useState<Set<number>>(new Set());

  const { data: sondages = [], isLoading } = useQuery({
    queryKey: ["candidat-sondages"],
    queryFn: candidatService.getSondages,
  });

  const repondreMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: SoumissionSondageRequest;
    }) => candidatService.repondreSondage(id, data),
    onSuccess: (_, { id }) => {
      setDeposes((prev) => new Set(prev).add(id));
      setSondageActif(null);
      setReponses({});
      queryClient.invalidateQueries({ queryKey: ["candidat-sondages"] });
      toast.success("Réponses soumises, merci !");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleRepondre = (sondage: Sondage) => {
    setSondageActif(sondage);
    setReponses({});
  };

  const handleSoumettre = () => {
    if (!sondageActif) return;
    const data: SoumissionSondageRequest = sondageActif.questions.map((q) => ({
      questionId: q.id,
      optionId: reponses[q.id]?.optionId,
      reponseLibre: reponses[q.id]?.reponseLibre,
    }));
    repondreMutation.mutate({ id: sondageActif.id, data });
  };

  // Vue formulaire sondage
  if (sondageActif) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSondageActif(null)}
            className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            ← Retour
          </button>
          <div>
            <h1 className="text-xl font-semibold">{sondageActif.titre}</h1>
            {sondageActif.anonyme && (
              <p className="text-xs text-neutral-400 mt-0.5">
                🔒 Réponses anonymes
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {sondageActif.questions
            ?.sort((a, b) => a.ordre - b.ordre)
            .map((q, index) => (
              <div
                key={q.id}
                className="flex flex-col gap-3 p-5 bg-white border border-neutral-100 rounded-2xl"
              >
                <p className="text-sm font-medium">
                  <span className="text-neutral-400 mr-2">{index + 1}.</span>
                  {q.enonce}
                </p>

                {(q.type === "QCM" || q.type === "VRAI_FAUX") && (
                  <div className="flex flex-col gap-2">
                    {q.options?.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() =>
                          setReponses((prev) => ({
                            ...prev,
                            [q.id]: { optionId: opt.id },
                          }))
                        }
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${
                          reponses[q.id]?.optionId === opt.id
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                            reponses[q.id]?.optionId === opt.id
                              ? "border-white bg-white"
                              : "border-neutral-300"
                          }`}
                        />
                        {opt.texte}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === "REPONSE_LIBRE" && (
                  <textarea
                    value={reponses[q.id]?.reponseLibre ?? ""}
                    onChange={(e) =>
                      setReponses((prev) => ({
                        ...prev,
                        [q.id]: { reponseLibre: e.target.value },
                      }))
                    }
                    rows={3}
                    placeholder="Votre réponse..."
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
                  />
                )}
              </div>
            ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSoumettre}
            disabled={repondreMutation.isPending}
            className="px-6 py-3 bg-neutral-900 text-white text-sm rounded-2xl disabled:opacity-50 transition-colors"
          >
            {repondreMutation.isPending
              ? "Soumission..."
              : "Soumettre mes réponses"}
          </button>
        </div>
      </div>
    );
  }

  // Vue liste sondages
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Sondages</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Donnez votre avis sur les formations
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Chargement...</p>
      ) : sondages.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-sm">Aucun sondage disponible pour le moment.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sondages.map((s) => {
            const dejaDepose = deposes.has(s.id);
            return (
              <div
                key={s.id}
                className={`flex items-center justify-between p-5 rounded-2xl border ${
                  dejaDepose
                    ? "bg-neutral-50 border-neutral-100 opacity-60"
                    : "bg-white border-neutral-100"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{s.titre}</p>
                  <div className="flex gap-3 text-xs text-neutral-400">
                    <span>{s.domaine?.nom}</span>
                    <span>{s.questions?.length} question(s)</span>
                    {s.anonyme && <span>🔒 Anonyme</span>}
                    <span>
                      Jusqu'au {new Date(s.dateFin).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  {s.description && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {s.description}
                    </p>
                  )}
                </div>

                {dejaDepose ? (
                  <span className="text-xs text-green-600 font-medium whitespace-nowrap ml-4">
                    ✓ Déposé
                  </span>
                ) : (
                  <button
                    onClick={() => handleRepondre(s)}
                    className="text-sm px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-700 transition-colors whitespace-nowrap ml-4"
                  >
                    Répondre
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
