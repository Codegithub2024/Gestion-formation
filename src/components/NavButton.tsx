import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
// import { createPortal } from "react-dom";
// import NavButtonTooltip from "./NavButtonTooltip";

gsap.registerPlugin(useGSAP);

type NavLinkProps = {
  to: string;
  text: string;
  children?: React.ReactNode;
  isNavbarOpen?: boolean;
};

export default function NavButton({ to, text, children, isNavbarOpen = true }: NavLinkProps) {
  // const [tooltipVisible, setTooltipVisible] = useState(false);
  // const [tooltipY, setTooltipY] = useState(0);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  // const handleMouseEnter = () => {
  //   if (isNavbarOpen) return; // tooltip inutile si la sidebar est ouverte

  //   if (buttonRef.current) {
  //     const rect = buttonRef.current.getBoundingClientRect();
  //     // Centre verticalement le tooltip sur le bouton
  //     setTooltipY(rect.top + rect.height / 2);
  //   }
  //   setTooltipVisible(true);
  // };

  // const handleMouseLeave = () => setTooltipVisible(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.set(spanRef, {
      x: isNavbarOpen ? 0 : 20,
      autoAlpha: isNavbarOpen ? 1 : 0,
    });
    tlRef.current = gsap.timeline().fromTo(
      spanRef.current,
      {
        x: 20,
        autoAlpha: 0,
      },
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.3,
        ease: "power2.inOut",
      },
    );
    if (isNavbarOpen) {
      tlRef.current.progress(1);
    }
  });

  useEffect(() => {
    if (!tlRef) return;
    if (isNavbarOpen) tlRef.current?.play();
    else tlRef.current?.reverse();
  }, [isNavbarOpen]);

  return (
    <>
      <NavLink
        ref={buttonRef}
        to={to}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        className={({ isActive }) =>
          `nav-button ring-1 ${
            isActive
              ? "bg-white text-neutral-800 ring-neutral-200"
              : "hover:bg-black/5 text-neutral-500 ring-transparent group"
          }`
        }
      >
        <p className="nav-button-text">
          {children}
          {/* Le texte reste dans le DOM pour que la sidebar anime sa disparition */}
          <span ref={spanRef} className={`span-nav-element `}>
            {text}
          </span>
        </p>
      </NavLink>

      {/* Tooltip téléporté hors de la sidebar */}
      {/*{!isNavbarOpen &&
        createPortal(<NavButtonTooltip text={text} y={tooltipY} visible={tooltipVisible} />, document.body)}*/}
    </>
  );
}

// export default function NavButton({
//   to,
//   text,
//   children,
// }: NavLinkProps) {
//   return (
//     <NavLink
//       to={`${to}`}
//       className={({ isActive }) =>
//         `nav-button ring-1 ${
//       isActive ? "bg-white text-neutral-800 ring-neutral-200"
//       : " hover:bg-black/5 text-neutral-500 ring-transparent"}`
//       }
//     >
//       <p className="nav-button-text">
//         {children}
//         {text}
//       </p>
//     </NavLink>
//   );
// }
