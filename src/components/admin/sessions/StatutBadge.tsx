// components/admin/sessions/StatutBadge.tsx
export default function StatutBadge({ statut }: { statut: string }) {
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
      className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles[statut] ?? "bg-neutral-100 text-neutral-600"}`}
    >
      {labels[statut] ?? statut}
    </span>
  );
}
