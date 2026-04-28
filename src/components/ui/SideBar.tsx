import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ChartPie,
  ConciergeBellIcon,
  Database,
  LucideArrowDownToDot,
  PanelLeftClose,
  PanelLeftOpen,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NavButton from "./NavButton";
import NavGroup from "./NavGroup";

// Largeurs en JS — une seule source de vérité, plus de classes Tailwind sur width
const SIDEBAR_OPEN = 290;
const SIDEBAR_CLOSE = 52;

export default function SideBar() {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebarOpen");
    // ton bug : JSON.parse("false") retourne false (ok) mais tu comparais à la string "false"
    return saved !== null ? JSON.parse(saved) : true;
  });

  const asideRef = useRef<HTMLElement>(null);
  const closeIconRef = useRef<SVGSVGElement>(null);
  const openIconRef = useRef<SVGSVGElement>(null);

  // Timeline principale de la sidebar — créée une fois, pilotée ensuite
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Persist
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  // ── Création des timelines (montage uniquement) ──────────────────────────
  useGSAP(() => {
    // État initial immédiat, sans animation (correspond à isOpen initial)
    gsap.set(asideRef.current, {
      width: isOpen ? SIDEBAR_OPEN : SIDEBAR_CLOSE,
    });
    // Les deux icônes sont rendues dans le DOM en permanence (voir JSX)
    gsap.set(closeIconRef.current, {
      scale: isOpen ? 1 : 0,
      autoAlpha: isOpen ? 1 : 0,
    });
    gsap.set(openIconRef.current, {
      scale: isOpen ? 0 : 1,
      autoAlpha: isOpen ? 0 : 1,
    });

    // Timeline : état fermé → état ouvert
    tlRef.current = gsap
      .timeline({ paused: true })
      .fromTo(
        asideRef.current,
        {
          width: SIDEBAR_CLOSE,
        },
        {
          width: SIDEBAR_OPEN,
          duration: 0.35,
          ease: "power2.inOut",
        },
        0,
      )
      .fromTo(
        closeIconRef.current,
        {
          scale: 0,
          autoAlpha: 0,
        },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.2,
          ease: "power2.out",
        },
        0.15,
      ) // décalage : l'icône apparaît quand la sidebar est presque ouverte
      .fromTo(
        openIconRef.current,
        {
          scale: 1,
          autoAlpha: 1,
        },
        {
          scale: 0,
          autoAlpha: 0,
          duration: 0.15,
          ease: "power2.in",
        },
        0,
      ); // l'icône "open" disparaît immédiatement

    // Si on démarre en état ouvert, on positionne la timeline à la fin
    if (isOpen) {
      tlRef.current.progress(1);
    }
  });

  // ── Pilotage de la timeline existante ────────────────────────────────────
  useEffect(() => {
    if (!tlRef.current) return;
    if (isOpen) tlRef.current.play();
    else tlRef.current.reverse();
  }, [isOpen]);

  return (
    <aside
      ref={asideRef}
      className="flex z-1000 flex-col sticky top-0 left-0 h-screen"
      // Pas de classe w-* : GSAP est seul maître de la largeur
    >
      <div className="flex justify-end py-2 p-2">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="hover:bg-black/10 flex justify-center items-center rounded-lg size-9 cursor-pointer"
        >
          {/* Les deux icônes sont TOUJOURS dans le DOM — GSAP gère leur visibilité */}
          <PanelLeftClose ref={closeIconRef} size={18} className="absolute" />
          <PanelLeftOpen ref={openIconRef} size={18} className="absolute" />
        </button>
      </div>

      <nav className="flex flex-col px-2">
        <NavGroup isNavbarOpen={isOpen} groupName="Principal">
          <NavButton isNavbarOpen={isOpen} to="/admin/dashboard" text="tableau de bord">
            <Database size={20} />
          </NavButton>
        </NavGroup>
        <NavGroup isNavbarOpen={isOpen} groupName="Utilisateurs">
          <NavButton isNavbarOpen={isOpen} to="/admin/user/comptes" text="Tous les comptes">
            <User size={20} />
          </NavButton>
          <NavButton isNavbarOpen={isOpen} to="/admin/user/rights" text="Rôles et droits">
            <LucideArrowDownToDot size={20} />
          </NavButton>
        </NavGroup>
        <NavGroup isNavbarOpen={isOpen} groupName="Nav">
          <NavButton isNavbarOpen={isOpen} to="/login" text="Login">
            <User size={20} />
          </NavButton>
          <NavButton isNavbarOpen={isOpen} to="/admin/user/rights" text="Rôles et droits">
            <LucideArrowDownToDot size={20} />
          </NavButton>
        </NavGroup>
        <NavButton isNavbarOpen={isOpen} to="/admin/utilisateurs" text="Utilisateurs">
          <ChartPie size={20} />
        </NavButton>
      </nav>
    </aside>
  );
}
