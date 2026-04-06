import { Outlet } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("isOpen");
    return saved !== null ? JSON.parse(saved) : "false";
  });
  const asideRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("isOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  console.log(isOpen);

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
            width: isOpen ? "0px" : "290px",
          },
          {
            width: isOpen ? "290px" : "0px",
            duration: 0.4,
            ease: "power2.out",
          },
        );

        isOpen
          ? toggleAnimation({
              open: ".close",
              close: ".open",
            })
          : toggleAnimation({
              open: ".open",
              close: ".close",
            });
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

  function toggleAnimation({ open, close }: { open: string; close: string }) {
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
  }

  return (
    <div ref={contentRef} className="flex">
      <aside
        ref={asideRef}
        className={`flex flex-col ${isOpen ? "w-72.5" : "w-0"} bg-neutral-200 overflow-hidden sticky top-0 left-0 h-screen`}
      >
        Admin layout
      </aside>
      <main className="flex flex-col flex-1">
        <nav className="flex  overflow-hidden p-2 border-b border-b-neutral-400">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-neutral-300 rounded-md h-9.5 p-2.5 cursor-pointer"
          >
            {isOpen ? (
              <PanelLeftClose className="close" size={18} />
            ) : (
              <PanelLeftOpen className="open" size={18} />
            )}
          </button>
        </nav>
        <Outlet />
      </main>
    </div>
  );
}
