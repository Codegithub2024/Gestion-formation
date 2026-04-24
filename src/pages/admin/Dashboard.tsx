import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth.store";
import { formateurService } from "../../api/services/formateur.service";
import Button from "../../components/Button";
import { statsService } from "../../api/services/stats.service";

export default function Dashboard() {
  const user = useAuthStore((set) => set.user);
  const queryClient = useQueryClient();

  // Lecture
  const { data: dashboardStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: statsService.getAllStats
      ? () => statsService.getAllStats()
      : undefined,
  });

  return (
    <div className="px-4 flex-1 flex">
      <div className="flex flex-1 container mx-auto flex-col gap-4 pt-6">
        <div className="flex wrap-anywhere w-full">
          <h1 className="lg:text-3xl text-xl font-semibold text-neutral-800 leading-12 tracking-tight">
            Bienvenu "{user?.prenom} {user?.nom}"
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-4 rounded-xl">
          <div className="flex flex-col w-full rounded-2xl bg-white overflow-hidden">
            <div className="flex items-center p-4 gap-4">
              <p className="texdy-amber-text/10 text-sm font-semibold text-neutral-500 leading-4.5 rounded-sm">
                Total formateurs
              </p>
            </div>
            <div className="flex items-center p-4 flex-1">
              <span className="font-semibold text-5xl tracking-tight leading-8 text-blue-400">
                {dashboardStats?.totalUtilisateurs || 0}
              </span>
            </div>
          </div>
          <div className="flex flex-col w-full rounded-2xl bg-white overflow-hidden">
            <div className="flex items-center p-4 gap-4">
              <p className="texdy-amber-text/10 text-sm font-semibold text-neutral-500 leading-4.5 rounded-sm">
                Total formateurs
              </p>
            </div>
            <div className="flex items-center p-4 flex-1">
              <span className="font-semibold text-5xl tracking-tight leading-8 text-blue-400">
                {dashboardStats?.totalUtilisateurs || 0}
              </span>
            </div>
          </div>
          <div className="flex flex-col w-full rounded-2xl bg-white overflow-hidden">
            <div className="flex items-center p-4 gap-4">
              <p className="texdy-amber-text/10 text-sm font-semibold text-neutral-500 leading-4.5 rounded-sm">
                Total formateurs
              </p>
            </div>
            <div className="flex items-center p-4 flex-1">
              <span className="font-semibold text-5xl tracking-tight leading-8 text-blue-400">
                {dashboardStats?.totalUtilisateurs || 0}
              </span>
            </div>
          </div>
          <div className="flex flex-col w-full rounded-2xl bg-white overflow-hidden">
            <div className="flex items-center p-4 gap-4">
              <p className="texdy-amber-text/10 text-sm font-semibold text-neutral-500 leading-4.5 rounded-sm">
                Total formateurs
              </p>
            </div>
            <div className="flex items-center p-4 flex-1">
              <span className="font-semibold text-5xl tracking-tight leading-8 text-blue-400">
                {dashboardStats?.totalUtilisateurs || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
