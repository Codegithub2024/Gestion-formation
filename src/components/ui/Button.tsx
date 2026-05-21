import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, type MouseEventHandler } from "react";
import { Plus } from "lucide-react";

gsap.registerPlugin(useGSAP);

type ButtonStyle = "amber" | "black" | "red";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  state?: boolean;
  children?: React.ReactNode;
  placeAfter?: boolean;
  buttonStyle?: ButtonStyle;
  add?: boolean;
}

export default function Button({
  text,
  state,
  children,
  placeAfter,
  buttonStyle = "black",
  className: classname,
  onClick,
  add,
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Styles Tailwind par variante
  const styleMap: Record<ButtonStyle, string> = {
    amber:
      "bg-primary-amber text-primary-amber-text hover:ring-primary-amber-text/50 active:ring-primary-amber-text",
    black: "bg-neutral-800 hover:bg-neutral-900 text-neutral-50",
    red: "bg-primary-red-text text-primary-red hover:ring-primary-red/50 active:ring-primary-red",
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={state}
      className={`group button ${styleMap[buttonStyle]} ${classname || ""}`}
    >
      {state ? (
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin opacity-90" />
          <span className="text-sm font-semibold tracking-tight leading-none">
            Chargement
          </span>
        </div>
      ) : (
        <p ref={textRef} className="button-text">
          {!placeAfter && children}
          {add && <Plus size={16} className="stroke-3" />}
          {text}
          {placeAfter && children}
        </p>
      )}
    </button>
  );
}
