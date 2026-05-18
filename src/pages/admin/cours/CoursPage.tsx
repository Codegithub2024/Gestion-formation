import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDialogStore } from "../../../store/dialog.store";
import CoursForm from "../../../components/admin/cours/CoursForm";
import toast from "react-hot-toast";
import type {
  CreateCoursRequest,
  UpdateCoursRequest,
} from "../../../types/requests.types";
import { coursService } from "../../../services/cours.service";
import { ApiError } from "../../../api/base.api";
import type { Cours } from "../../../types/cours.types";
import Button from "../../../components/ui/Button";
import CoursTable from "../../../components/admin/cours/CoursTable";
import { Plus } from "lucide-react";

export default function CoursPage() {
  const { open, close } = useDialogStore();
  const queryClient = useQueryClient();

  const {
    data: cours = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cours"],
    queryFn: coursService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: coursService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cours"] });
      close();
      toast.success("cours ajouté avec succès");
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(`${err.status} ${err.message}`);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCoursRequest }) =>
      coursService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cours"] });
      close();
      toast.success("Mise à jour effectuée avec succès");
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: coursService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cours"] });
      toast.success("cours suprimé");
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(err.message);
      }
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleCreer = () => {
    open(
      "Nouveau cours",
      <CoursForm
        cours={null}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        errorMsg={createMutation.error?.message}
      />,
    );
  };

  const handleEditer = (cours: Cours) => {
    open(
      "Modifier le cours",
      <CoursForm
        cours={cours}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        errorMsg={updateMutation.error?.message}
      />,
    );
  };

  const handleSubmit = (
    data: CreateCoursRequest | UpdateCoursRequest,
    id?: number,
  ) => {
    if (id !== undefined) {
      // id présent → mise à jour
      updateMutation.mutate({ id, data: data as UpdateCoursRequest });
    } else {
      // pas d'id → création
      createMutation.mutate(data as CreateCoursRequest);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-neutral-800 font-semibold">cours</h1>
        <Button
          onClick={handleCreer}
          text="Nouveau cours"
          buttonStyle="amber"
          className="px-2"
        >
          <Plus size={18} />
        </Button>
      </div>

      <CoursTable onEdit={handleEditer} cours={cours} onDelete={handleDelete} />
    </>
  );
}
