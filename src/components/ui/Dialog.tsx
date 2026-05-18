// components/ui/Dialog.tsx
import { useEffect, useRef } from "react";
import { useDialogStore } from "../../store/dialog.store";
import { X } from "lucide-react";

export default function Dialog() {
  const { isOpen, titre, content, close } = useDialogStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) close();
      }}
      className={`fixed inset-0 z-5000 transition-all duration-300 flex overflow-y-scroll py-10 items-center-safe justify-center-safe ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-xs"></div>
      <div className="relative flex flex-col z-10 gap-3 w-full max-w-md mx-4">
        <button
          onClick={close}
          className="text-red-50 absolute cursor-pointer hover:brightness-95 duration-150 top-1 right-1 p-1.5 active:scale-95 bg-red-500 ring-2 ring-red-500 border border-white hover:scale-[1.02] rounded-full transition-all flex items-center justify-center"
        >
          <X size={16} strokeWidth={3} />
        </button>
        {titre && (
          <div className="flex py-2 p-4 bg-white max-w-[80%] w-fit border-b rounded-full border-b-neutral-200 items-center overflow-hidden">
            <h2 className="text-base font-semibold leading-none hyphens-auto text-neutral-800">
              {titre}
            </h2>
          </div>
        )}
        <div className="bg-white rounded-2xl">{content}</div>
      </div>
    </div>
  );
}
