// pages/admin/formateurs/FormateursPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDialogStore } from "../../../store/dialog.store";
import { formateurService } from "../../../services/formateur.service";
import { coursService } from "../../../services/cours.service";
import { utilisateurService } from "../../../services/utilisateur.service";
import FormateurInterneTable from "../../../components/admin/formateurs/FormateurInterneTable";
import FormateurExterneTable from "../../../components/admin/formateurs/FormateurExterneTable";
import FormateurInterneForm from "../../../components/admin/formateurs/FormateurInterneForm";
import FormateurExterneForm from "../../../components/admin/formateurs/FormateurExterneForm";
import CoursAssignationForm from "../../../components/admin/formateurs/CoursAssignationForm";
import ConfirmSuppression from "../../../components/ui/ConfirmSuppression";
import type {
  FormateurInterne,
  FormateurExterne,
} from "../../../types/formateur.types";
import type { CreateFormateurExterneRequest } from "../../../types/requests.types";
import Button from "../../../components/ui/Button";
import { Plus } from "lucide-react";

type Onglet = "internes" | "externes";

export default function FormateursPage() {
  const [onglet, setOnglet] = useState<Onglet>("internes");
  const { open, close } = useDialogStore();
  const queryClient = useQueryClient();

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: formateursInternes = [], isLoading: loadingInternes } =
    useQuery({
      queryKey: ["formateurs-internes"],
      queryFn: formateurService.getAllInternes,
    });

  const { data: formateursExternes = [], isLoading: loadingExternes } =
    useQuery({
      queryKey: ["formateurs-externes"],
      queryFn: formateurService.getAllExternes,
    });

  const { data: tousLesCours = [] } = useQuery({
    queryKey: ["cours"],
    queryFn: coursService.getAll,
  });

  const { data: utilisateurs = [] } = useQuery({
    queryKey: ["utilisateurs"],
    queryFn: utilisateurService.getAll,
  });

  // ── Mutations internes ────────────────────────────────────────────────────
  const createInterneMutation = useMutation({
    mutationFn: (utilisateurId: number) =>
      formateurService.createInterne(utilisateurId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs-internes"] });
      toast.success("Formateur interne créé");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteInterneMutation = useMutation({
    mutationFn: (id: number) => formateurService.deleteInterne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs-internes"] });
      toast.success("Formateur interne supprimé");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const assignerCoursInterneMutation = useMutation({
    mutationFn: ({
      formateurId,
      coursId,
    }: {
      formateurId: number;
      coursId: number;
    }) => formateurService.assignerCoursInterne(formateurId, coursId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs-internes"] });
      toast.success("Cours assigné");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const retirerCoursInterneMutation = useMutation({
    mutationFn: ({
      formateurId,
      coursId,
    }: {
      formateurId: number;
      coursId: number;
    }) => formateurService.retirerCoursInterne(formateurId, coursId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs-internes"] });
      toast.success("Cours retiré");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Mutations externes ────────────────────────────────────────────────────
  const createExterneMutation = useMutation({
    mutationFn: (data: CreateFormateurExterneRequest) =>
      formateurService.createExterne(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs-externes"] });
      toast.success("Formateur externe créé");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateExterneMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreateFormateurExterneRequest;
    }) => formateurService.updateExterne(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs-externes"] });
      toast.success("Formateur externe modifié");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteExterneMutation = useMutation({
    mutationFn: (id: number) => formateurService.deleteExterne(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs-externes"] });
      toast.success("Formateur externe supprimé");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const assignerCoursExterneMutation = useMutation({
    mutationFn: ({
      formateurId,
      coursId,
    }: {
      formateurId: number;
      coursId: number;
    }) => formateurService.assignerCoursExterne(formateurId, coursId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs-externes"] });
      toast.success("Cours assigné");
      close();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const retirerCoursExterneMutation = useMutation({
    mutationFn: ({
      formateurId,
      coursId,
    }: {
      formateurId: number;
      coursId: number;
    }) => formateurService.retirerCoursExterne(formateurId, coursId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["formateurs-externes"] });
      toast.success("Cours retiré");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Handlers internes ─────────────────────────────────────────────────────

  // Filtre les utilisateurs qui ont le rôle FORMATEUR
  // et qui n'ont pas encore de profil FormateurInterne
  const utilisateursSansProfilFormateur = utilisateurs.filter(
    (u) =>
      u.role === "FORMATEUR" &&
      !formateursInternes.some((f) => f.utilisateur.id === u.id),
  );

  const handleCreerInterne = () => {
    open(
      "Nouveau formateur interne",
      <FormateurInterneForm
        utilisateurs={utilisateursSansProfilFormateur}
        onSubmit={(utilisateurId) =>
          createInterneMutation.mutate(utilisateurId)
        }
        isLoading={createInterneMutation.isPending}
      />,
    );
  };

  const handleSupprimerInterne = (formateur: FormateurInterne) => {
    open(
      "Confirmer la suppression",
      <ConfirmSuppression
        message={`Supprimer le profil de ${formateur.utilisateur.prenom} ${formateur.utilisateur.nom} ?`}
        detail="Les cours enseignables associés seront également supprimés."
        isLoading={deleteInterneMutation.isPending}
        onConfirm={() => deleteInterneMutation.mutate(formateur.id)}
        onAnnuler={close}
      />,
    );
  };

  const handleGererCoursInterne = (formateur: FormateurInterne) => {
    // Cours non encore assignés à ce formateur
    const coursDisponibles = tousLesCours.filter(
      (c) => !formateur.coursEnseignables.some((ce) => ce.id === c.id),
    );
    open(
      `Cours de ${formateur.utilisateur.prenom} ${formateur.utilisateur.nom}`,
      <CoursAssignationForm
        coursAssignes={formateur.coursEnseignables}
        coursDisponibles={coursDisponibles}
        onAssigner={(coursId) =>
          assignerCoursInterneMutation.mutate({
            formateurId: formateur.id,
            coursId,
          })
        }
        onRetirer={(coursId) =>
          retirerCoursInterneMutation.mutate({
            formateurId: formateur.id,
            coursId,
          })
        }
        isLoading={
          assignerCoursInterneMutation.isPending ||
          retirerCoursInterneMutation.isPending
        }
      />,
    );
  };

  // ── Handlers externes ─────────────────────────────────────────────────────
  const handleCreerExterne = () => {
    open(
      "Nouveau formateur externe",
      <FormateurExterneForm
        formateur={null}
        onSubmit={(data) => createExterneMutation.mutate(data)}
        isLoading={createExterneMutation.isPending}
      />,
    );
  };

  const handleEditerExterne = (formateur: FormateurExterne) => {
    open(
      "Modifier le formateur externe",
      <FormateurExterneForm
        formateur={formateur}
        onSubmit={(data) =>
          updateExterneMutation.mutate({ id: formateur.id, data })
        }
        isLoading={updateExterneMutation.isPending}
      />,
    );
  };

  const handleSupprimerExterne = (formateur: FormateurExterne) => {
    open(
      "Confirmer la suppression",
      <ConfirmSuppression
        message={`Supprimer ${formateur.prenom} ${formateur.nom} ?`}
        isLoading={deleteExterneMutation.isPending}
        onConfirm={() => deleteExterneMutation.mutate(formateur.id)}
        onAnnuler={close}
      />,
    );
  };

  const handleGererCoursExterne = (formateur: FormateurExterne) => {
    const coursDisponibles = tousLesCours.filter(
      (c) => !formateur.coursEnseignables.some((ce) => ce.id === c.id),
    );
    open(
      `Cours de ${formateur.prenom} ${formateur.nom}`,
      <CoursAssignationForm
        coursAssignes={formateur.coursEnseignables}
        coursDisponibles={coursDisponibles}
        onAssigner={(coursId) =>
          assignerCoursExterneMutation.mutate({
            formateurId: formateur.id,
            coursId,
          })
        }
        onRetirer={(coursId) =>
          retirerCoursExterneMutation.mutate({
            formateurId: formateur.id,
            coursId,
          })
        }
        isLoading={
          assignerCoursExterneMutation.isPending ||
          retirerCoursExterneMutation.isPending
        }
      />,
    );
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Formateurs</h1>
          <p className="text-sm text-neutral-500">
            {formateursInternes.length} interne(s) · {formateursExternes.length}{" "}
            externe(s)
          </p>
        </div>
        <Button
          text={
            onglet === "internes"
              ? "Nouveau formateur interne"
              : "Nouveau formateur externe"
          }
          onClick={
            onglet === "internes" ? handleCreerInterne : handleCreerExterne
          }
          buttonStyle="amber"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 ring-1 ring-black/10 overflow-hidden bg-black/5 rounded-xl w-fit">
        {(["internes", "externes"] as Onglet[]).map((o) => (
          <button
            key={o}
            onClick={() => setOnglet(o)}
            className={`px-4 py-1.5 text-sm rounded transition-all capitalize ${
              onglet === o
                ? "bg-white text-neutral-900 font-medium shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {o}
          </button>
        ))}
      </div>

      {/* Contenu selon onglet */}
      {onglet === "internes" && (
        <FormateurInterneTable
          formateurs={formateursInternes}
          isLoading={loadingInternes}
          onSupprimer={handleSupprimerInterne}
          onGererCours={handleGererCoursInterne}
        />
      )}

      {onglet === "externes" && (
        <FormateurExterneTable
          formateurs={formateursExternes}
          isLoading={loadingExternes}
          onEditer={handleEditerExterne}
          onSupprimer={handleSupprimerExterne}
          onGererCours={handleGererCoursExterne}
        />
      )}
    </div>
  );
}
