import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, type MouseEventHandler } from "react";

gsap.registerPlugin(useGSAP);

type ButtonStyle = "blue" | "amber" | "pink" | "red";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  state?: boolean;
  children?: React.ReactNode;
  placeAfter?: boolean;
  buttonStyle?: ButtonStyle;
}

export default function Button({
  text,
  state,
  children,
  placeAfter,
  buttonStyle = "blue",
  onClick,
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Styles Tailwind par variante
  const styleMap: Record<ButtonStyle, string> = {
    blue: "bg-primary-blue text-primary-blue-text hover:ring-primary-blue-text/50 active:ring-primary-blue-text",
    amber:
      "bg-primary-amber text-primary-amber-text hover:ring-primary-amber-text/50 active:ring-primary-amber-text",
    pink: "bg-primary-pink text-primary-pink-text hover:ring-primary-pink-text/50 active:ring-primary-pink-text",
    red: "bg-primary-red-text text-primary-red hover:ring-primary-red/50 active:ring-primary-red",
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={state}
      className={`group button ${styleMap[buttonStyle]}`}
    >
      {state ? (
        <div className="flex items-center justify-center gap-1.5">
          {/* Spinner CSS pur, pas de dépendance Lucide */}
          <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin opacity-90" />
          <span className="text-sm font-semibold tracking-tight leading-none">
            Chargement
          </span>
        </div>
      ) : (
        <p ref={textRef} className="button-text">
          {!placeAfter && children}
          {text}
          {placeAfter && children}
        </p>
      )}
    </button>
  );
}
