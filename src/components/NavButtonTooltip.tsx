import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  text: string;
  y: number;
  visible: boolean;
};

export default function NavButtonTooltip({ text, y, visible }: Props) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tooltipRef.current) return;

    if (visible) {
      // On part de x légèrement décalé pour un effet de glissement
      gsap.fromTo(
        tooltipRef.current,
        { autoAlpha: 0, x: -6 },
        { autoAlpha: 1, x: 0, duration: 0.18, ease: "power2.out" },
      );
    } else {
      gsap.to(tooltipRef.current, {
        autoAlpha: 0,
        x: -4,
        duration: 0.12,
        ease: "power2.in",
      });
    }
  }, [visible]);

  return (
    <div
      ref={tooltipRef}
      // 48px = largeur de la sidebar fermée + petit gap
      style={{ top: y, left: 56, transform: "translateY(-50%)" }}
      className="fixed z-50 pointer-events-none"
    >
      <div className="bg-neutral-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap">
        {text}
      </div>
    </div>
  );
}
