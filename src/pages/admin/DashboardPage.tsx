import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth.store";
import { statsService } from "../../services/stats.service";
import { CalendarDaysIcon, ChevronRight, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "../../components/ui/Container";
import StatCard from "../../components/admin/StatCard";
import { assets } from "../../assets/assets";
import SvgAnimation from "../../components/ui/SvgAnimation";
// import Svgdraw from "../../assets/tilda_2026-05-20_00-03-56.svg";

gsap.registerPlugin(useGSAP);

export default function DashboardPage() {
  const user = useAuthStore((set) => set.user);
  const queryClient = useQueryClient();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  console.log(user);

  // Lecture
  const { data: dashboardStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: statsService.getAllStats ? () => statsService.getAllStats() : undefined,
  });

  const animRef = useRef<gsap.core.Timeline>(null);

  useGSAP(
    () => {
      gsap.set(".card", { autoAlpha: 0, y: 10 });
      animRef.current = gsap.timeline().to(".card", {
        autoAlpha: 1,
        y: 0,
        duration: 0.25,
        ease: "back.out(1.7)",
        stagger: 0.085,
        delay: 0.3,
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
    <>
      <div className="flex w-full wrap-anywhere">
        <h1 className="text-xl font-semibold flex gap-2 tracking-tight lg:text-3xl text-neutral-800 leading-12">
          <p className="text-neutral-500">Bienvenue</p>
          <div className="relative">
            {user?.prenom} {user?.nom}
            <SvgAnimation />
          </div>
        </h1>
      </div>

      <div ref={dashboardRef} className="flex flex-col gap-3">
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
          <StatCard
            name="Sessions en cours"
            value={dashboardStats?.sessionsEnCours}
            icon={<Users size={18} />}
          />
          <StatCard
            name="Total Utilisateurs"
            value={dashboardStats?.totalUtilisateurs}
            icon={<Users size={18} />}
          />
          <StatCard
            name="Total Formateurs"
            value={dashboardStats?.totalFormateurs}
            icon={<Users size={18} />}
          />
          <StatCard
            name="Total Candidats"
            value={dashboardStats?.totalCandidats}
            icon={<Users size={18} />}
          />
          <StatCard
            name="Sessions Planifiées"
            value={dashboardStats?.sessionsPlanifiees}
            icon={<CalendarDaysIcon size={18} />}
          />
          <StatCard
            name="Cours actifs"
            value={dashboardStats?.coursActifs}
            icon={<CalendarDaysIcon size={18} />}
          />
          <StatCard
            name="Sessions Terminés"
            value={dashboardStats?.sessionsTerminees}
            icon={<CalendarDaysIcon size={18} />}
          />
          <StatCard
            name="Total Inscriptions"
            value={dashboardStats?.totalInscriptions}
            icon={<CalendarDaysIcon size={18} />}
          />
          <StatCard
            name="Taux de Presence"
            value={dashboardStats?.tauxPresence}
            icon={<CalendarDaysIcon size={18} />}
          />
          <StatCard
            name="Taux de Reussite"
            value={dashboardStats?.tauxReussite}
            icon={<CalendarDaysIcon size={18} />}
          />
        </div>
      </div>
    </>
  );
}
