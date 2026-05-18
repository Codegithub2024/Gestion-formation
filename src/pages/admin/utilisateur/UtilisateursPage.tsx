import { Plus, User2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import { useDialogStore } from "../../../store/dialog.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { utilisateurService } from "../../../services/utilisateur.service";
import UtilisateurForm from "../../../components/admin/utilisateur/UtilisateurForm";
import type {
  CreateUtilisateurRequest,
  UpdateUtilisateurRequest,
} from "../../../types/requests.types";
import UtilisateurTable from "../../../components/admin/utilisateur/UtilisateurTable";
import type { Utilisateur } from "../../../types/utilisateur.types";
import { ApiError } from "../../../api/base.api";
import toast from "react-hot-toast";

export default function UtilisateursPage() {
  const { open, close } = useDialogStore();
  const queryClient = useQueryClient();

  const {
    data: utilisateurs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["utilisateurs"],
    queryFn: utilisateurService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: utilisateurService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
      close();
      toast.success("Utilisateur ajouté avec succès");
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateUtilisateurRequest;
    }) => utilisateurService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
      close();
      toast.success("Mise à jour effectuée avec succès");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: utilisateurService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
      toast.success("Utilisateur suprimé");
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(`${err.status} ${err.message}`);
      }
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleCreer = () => {
    open(
      "Nouvel utilisateur",
      <UtilisateurForm
        utilisateur={null}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        errorMsg={createMutation.error?.message}
      />,
    );
  };

  const handleEditer = (utilisateur: Utilisateur) => {
    open(
      `Modifier l'utilisateur`,
      <UtilisateurForm
        utilisateur={utilisateur}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        errorMsg={updateMutation.error?.message}
      />,
    );
  };

  const handleSubmit = (
    data: CreateUtilisateurRequest | UpdateUtilisateurRequest,
    id?: number,
  ) => {
    if (id !== undefined) {
      // id présent → mise à jour
      updateMutation.mutate({ id, data: data as UpdateUtilisateurRequest });
    } else {
      // pas d'id → création
      createMutation.mutate(data as CreateUtilisateurRequest);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl text-neutral-800 font-semibold">
            Utilisateurs
          </h1>
          {utilisateurs.length !== 0 && (
            <p className="font-medium text-sm flex gap-1 items-center text-neutral-600">
              {utilisateurs.length} utilisateurs
            </p>
          )}
        </div>
        <Button
          onClick={handleCreer}
          text="Nouvel utilisateur"
          buttonStyle="black"
          className="px-2"
        >
          <Plus size={18} />
        </Button>
      </div>

      <UtilisateurTable
        onEdit={handleEditer}
        utilisateurs={utilisateurs}
        onDelete={handleDelete}
      />
    </>
  );
}
