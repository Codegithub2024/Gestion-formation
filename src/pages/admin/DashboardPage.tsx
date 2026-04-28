import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth.store";
import { statsService } from "../../api/services/stats.service";
import { ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function DashboardPage() {
  const user = useAuthStore((set) => set.user);
  const queryClient = useQueryClient();
  const dashboardRef = useRef<HTMLDivElement>(null);

  console.log(user);

  // Lecture
  const { data: dashboardStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: statsService.getAllStats
      ? () => statsService.getAllStats()
      : undefined,
  });

  const animRef = useRef<gsap.core.Timeline>(null);

  useGSAP(
    () => {
      gsap.set(".card", { autoAlpha: 0, y: 10 });
      animRef.current = gsap.timeline().to(".card", {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: "expo.out",
        stagger: 0.085,
        delay: 0.1,
        overwrite: true,
      });
    },
    { scope: dashboardRef },
  );

  useEffect(() => {
    // if (dashboardStats) {
    //   queryClient.setQueryData(["dashboardStats"], dashboardStats);
    // }
    if (!dashboardRef || !dashboardStats) return;
    else animRef.current?.play();
  }, [dashboardStats]);

  return (
    <div ref={dashboardRef} className="flex flex-1 min-h-screen px-4 w-full">
      <div className="container flex flex-col flex-1 gap-4 pt-6 mx-auto">
        <div className="flex w-full wrap-anywhere">
          <h1 className="text-xl font-semibold tracking-tight lg:text-3xl text-neutral-800 leading-12">
            <span className="text-neutral-500">Bienvenue</span> "{user?.prenom}{" "}
            {user?.nom}"
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-green-500 rounded-full size-2"></span>
              <h4 className="text-2xl font-semibold tracking-tight text-neutral-800">
                Statistiques générales
              </h4>
            </div>
            <NavLink to="#">
              <p className="flex items-center gap-1 text-sm font-semibold transition-all duration-150 hover:text-neutral-800 text-neutral-500">
                Voir plus
                <ChevronRight className="w-4 h-4" />
              </p>
            </NavLink>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 rounded-xl">
            <div className="flex flex-col w-full overflow-hidden bg-white card rounded-2xl">
              <div className="flex items-center p-4 py-2.5 gap-4 border-b-2 border-b-neutral-100">
                <p className="texdy-amber-text/10 text-sm font-semibold text-neutral-500 leading-4.5 rounded-sm">
                  Total Utilisateurs
                </p>
              </div>
              <div className="flex items-center flex-1 p-4 py-6">
                <span className="text-5xl font-semibold leading-8 tracking-tight text-blue-400">
                  {dashboardStats?.totalUtilisateurs || 0}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full overflow-hidden bg-white card rounded-2xl">
              <div className="flex items-center p-4 py-2.5 gap-4 border-b-2 border-b-neutral-100">
                <p className="texdy-amber-text/10 text-sm font-semibold text-neutral-500 leading-4.5 rounded-sm">
                  Total formateurs
                </p>
              </div>
              <div className="flex items-center flex-1 p-4 py-6">
                <span className="text-5xl font-semibold leading-8 tracking-tight text-blue-400">
                  {dashboardStats?.totalFormateurs || 0}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full overflow-hidden bg-white card rounded-2xl">
              <div className="flex items-center p-4 py-2.5 gap-4 border-b-2 border-b-neutral-100">
                <p className="texdy-amber-text/10 text-sm font-semibold text-neutral-500 leading-4.5 rounded-sm">
                  Total Candidats
                </p>
              </div>
              <div className="flex items-center flex-1 p-4 py-6">
                <span className="text-5xl font-semibold leading-8 tracking-tight text-blue-400">
                  {dashboardStats?.totalCandidats || 0}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full overflow-hidden bg-white card rounded-2xl">
              <div className="flex items-center p-4 py-2.5 gap-4 border-b-2 border-b-neutral-100">
                <p className="texdy-amber-text/10 text-sm font-semibold text-neutral-500 leading-4.5 rounded-sm">
                  Sessions planifiées
                </p>
              </div>
              <div className="flex items-center flex-1 p-4 py-6">
                <span className="text-5xl font-semibold leading-8 tracking-tight text-blue-400">
                  {dashboardStats?.sessionsPlanifiees || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
