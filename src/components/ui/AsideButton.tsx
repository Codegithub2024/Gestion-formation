import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { Ref } from "react";

type AsideButtonType = {
  isOpen: () => void;
  closeIconRef: Ref<SVGSVGElement | null>;
  openIconRef: Ref<SVGSVGElement | null>;
};

export default function AsideButton({
  isOpen,
  closeIconRef,
  openIconRef,
}: AsideButtonType) {
  return (
    <button
      onClick={isOpen}
      className="hover:bg-black/10 flex justify-center items-center rounded-lg size-9 cursor-pointer"
    >
      {/* Les deux icônes sont TOUJOURS dans le DOM — GSAP gère leur visibilité */}
      <PanelLeftClose ref={closeIconRef} size={18} className="absolute" />
      <PanelLeftOpen ref={openIconRef} size={18} className="absolute" />
    </button>
  );
}
