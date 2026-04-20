import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ChartPie,
  ConciergeBellIcon,
  Database,
  LucideArrowDownToDot,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import NavButton from "./NavButton";

interface ComponentNameProps {
  contentRef: RefObject<null>;
}

export default function SideBar({ contentRef }: ComponentNameProps) {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("isOpen");
    return saved !== null ? JSON.parse(saved) : "false";
  });

  const asideRef = useRef(null);
  useEffect(() => {
    localStorage.setItem("isOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  console.log(isOpen);

  const toggleAnimation = (open: string, close: string) => {
    const tl = gsap.timeline();
    tl.fromTo(
      close,
      {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      },
      {
        scale: 0,
        duration: 0.2,
        ease: "power2.out",
      },
    ).fromTo(
      open,
      {
        scale: 0,
        duration: 0.2,
        ease: "power2.out",
      },
      {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      },
    );
  };

  // 1. On garde en mémoire si c'est le montage initial
  const isFirstRender = useRef(true);
  // 2. On garde en mémoire la version précédente pour comparer
  const prevOpen = useRef(isOpen);

  useGSAP(
    () => {
      // CONDITION 1 : Si c'est le tout premier affichage (ou retour de route), on ne fait RIEN.
      // Le CSS Tailwind (w-75 ou w-0) s'occupe de placer l'élément correctement sans flash.
      if (isFirstRender.current) {
        isFirstRender.current = false;
        prevOpen.current = isOpen; // On synchronise
        return;
      }

      // CONDITION 2 : On n'anime que si isOpen a changé
      if (prevOpen.current !== isOpen) {
        gsap.fromTo(
          asideRef.current,
          {
            // On force le départ de l'ancienne valeur
            width: isOpen ? "48px" : "290px",
          },
          {
            width: isOpen ? "290px" : "48px",
            duration: 0.4,
            ease: "power2.out",
          },
        );

        if (isOpen) toggleAnimation(".close", ".open");
        else toggleAnimation(".open", ".close");
        // On met à jour la valeur précédente pour le prochain rendu
        prevOpen.current = isOpen;
      }
    },
    {
      dependencies: [isOpen],
      scope: contentRef,
      revertOnUpdate: true,
    },
  );

  return (
    <aside
      ref={asideRef}
      className={`flex flex-col ${isOpen ? "w-72.5" : "w-12"} overflow-hidden sticky top-0 left-0 h-screen`}
    >
      <div className={`flex justify-end py-4 px-1.5 `}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-black/10 flex justify-center items-center rounded-md h-8 p-2 cursor-pointer"
        >
          {isOpen ? (
            <PanelLeftClose className="close" size={18} />
          ) : (
            <PanelLeftOpen className="open" size={18} />
          )}
        </button>
      </div>
      <nav className="flex flex-col p-2">
        <NavButton to="/admin/dashboard" text="Dashboard">
          <Database size={18} />
        </NavButton>
        <NavButton to="/login" text="Login">
          <ConciergeBellIcon size={18} />
        </NavButton>
        <NavButton to="/register" text="Register">
          <LucideArrowDownToDot size={18} />
        </NavButton>
        <NavButton to="/admin/utilisateurs" text="Utilisateurs">
          <ChartPie size={18} />
        </NavButton>
      </nav>
    </aside>
  );
}
