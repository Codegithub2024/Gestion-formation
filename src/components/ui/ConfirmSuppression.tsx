type Props = {
  message: string;
  detail?: string; // optionnel — précision supplémentaire
  isLoading?: boolean;
  onConfirm: () => void;
  onAnnuler: () => void;
};

export default function ConfirmSuppression({
  message,
  detail,
  isLoading,
  onConfirm,
  onAnnuler,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-neutral-700">{message}</p>
      {detail && <p className="text-sm text-neutral-400">{detail}</p>}
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={onAnnuler}
          disabled={isLoading}
          className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-all"
        >
          {isLoading ? "Suppression..." : "Supprimer"}
        </button>
      </div>
    </div>
  );
}
