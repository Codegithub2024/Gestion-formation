import { Plus } from "lucide-react";
import { domaineService } from "../../../services/domaine.service";
import DomaineTable from "../../../components/admin/domaines/DomaineTable";
import Button from "../../../components/ui/Button";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DomaineForm from "../../../components/admin/domaines/DomaineForm";
import type { CreateDomaineRequest, UpdateDomaineRequest } from "../../../types/requests.types";
import { useDialogStore } from "../../../store/dialog.store";
import type { Domaine } from "../../../types/domaine.types";

export default function DomainesPage() {
  const queryClient = useQueryClient();
  const { open, close } = useDialogStore();
  const [domaine, setDomaine] = useState<Domaine | undefined>();

  const {
    data: domaines = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["domaines"],
    queryFn: domaineService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: domaineService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domaines"] });
      close();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDomaineRequest }) => domaineService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domaines"] });
      close();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: domaineService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domaines"] });
      console.log("message de succès");
    },
  });

  const handleSubmit = (data: CreateDomaineRequest | UpdateDomaineRequest, id?: number) => {
    if (id !== undefined) {
      // id présent → mise à jour
      updateMutation.mutate({ id, data: data as UpdateDomaineRequest });
    } else {
      // pas d'id → création
      createMutation.mutate(data as CreateDomaineRequest);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleCreer = () => {
    open(
      "Nouveau domaine",
      <DomaineForm
        domaine={null}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        errorMsg={createMutation.error?.message}
      />,
    );
  };

  const handleEditer = (domaine: Domaine) => {
    open(
      "Modifier le domaine",
      <DomaineForm
        domaine={domaine} // ← l'id est dans domaine.id, le form y accède
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        errorMsg={updateMutation.error?.message}
      />,
    );
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-neutral-800 font-semibold">Domaines</h1>
        <Button onClick={handleCreer} text="Nouveau domaine" buttonStyle="amber" className="px-2">
          <Plus size={18} />
        </Button>
      </div>

      <DomaineTable onEdit={handleEditer} domaine={domaines} onDelete={handleDelete} />
    </>
  );
}
