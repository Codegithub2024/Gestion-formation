import { useState } from "react";
import type { Convocation } from "../../../types/session.types";

type Props = {
  convocations: Convocation[];
};

const STATUT_STYLES: Record<string, string> = {
  ENVOYEE: "bg-blue-100 text-blue-700",
  RECUE: "bg-green-100 text-green-700",
  REFUSEE: "bg-red-100 text-red-600",
};

export default function ConvocationList({ convocations }: Props) {
  if (convocations.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-400">
        <p className="text-3xl mb-2">📧</p>
        <p className="text-sm">Aucune convocation envoyée.</p>
        <p className="text-xs mt-1">
          Confirmez des inscriptions puis envoyez les convocations.
        </p>
      </div>
    );
  }

  // Sépare candidats et formateur
  const convocationsCandidats = convocations.filter(
    (c) => c.inscription !== null,
  );
  const convocationsFormateur = convocations.filter(
    (c) => c.inscription === null,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Formateur */}
      {convocationsFormateur.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-neutral-700">Formateur</h3>
          {convocationsFormateur.map((c) => (
            <ConvocationCard key={c.id} convocation={c} />
          ))}
        </div>
      )}

      {/* Candidats */}
      {convocationsCandidats.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-neutral-700">
            Candidats ({convocationsCandidats.length})
          </h3>
          {convocationsCandidats.map((c) => (
            <ConvocationCard key={c.id} convocation={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConvocationCard({ convocation }: { convocation: Convocation }) {
  const [showContenu, setShowContenu] = useState(false);

  const destinataire = convocation.inscription
    ? `${convocation.inscription.utilisateur.prenom} ${convocation.inscription.utilisateur.nom}`
    : convocation.formateurInterne
      ? `${convocation.formateurInterne.utilisateur.prenom} ${convocation.formateurInterne.utilisateur.nom} (Formateur)`
      : convocation.formateurExterne
        ? `${convocation.formateurExterne.prenom} ${convocation.formateurExterne.nom} (Externe)`
        : "—";

  return (
    <div className="flex flex-col gap-2 p-4 bg-white border border-neutral-100 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium">{destinataire}</p>
          <p className="text-xs text-neutral-400">
            Envoyée le{" "}
            {new Date(convocation.dateEnvoi).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              STATUT_STYLES[convocation.statut] ?? "bg-neutral-100"
            }`}
          >
            {convocation.statut}
          </span>
          <button
            onClick={() => setShowContenu((p) => !p)}
            className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            {showContenu ? "Masquer" : "Voir"} le contenu
          </button>
        </div>
      </div>

      {showContenu && convocation.contenu && (
        <pre className="mt-2 p-3 bg-neutral-50 border border-neutral-100 rounded-lg text-xs text-neutral-600 whitespace-pre-wrap font-sans">
          {convocation.contenu}
        </pre>
      )}
    </div>
  );
}
