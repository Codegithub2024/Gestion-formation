// components/ui/Dialog.tsx
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
      className={`fixed inset-0 z-5000 transition-all duration-300 flex bg-black/10 overflow-y-scroll py-10 items-center-safe justify-center-safe ${isOpen ? "backdrop-blur-xs opacity-100" : "opacity-0"}`}
    >
      <div className="relative flex flex-col z-10 bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <button
          onClick={close}
          className="text-red-50 absolute cursor-pointer hover:brightness-95 duration-150 -top-3 -right-3 p-1 active:scale-95 bg-red-500 ring-2 ring-red-500 border border-white hover:scale-[1.02] rounded-full transition-all flex items-center justify-center"
        >
          <X size={16} strokeWidth={3} />
        </button>
        {titre && (
          <div className="flex px-10 py-4 border-b border-b-neutral-200 justify-center items-center text-center">
            <h2 className="text-lg font-semibold">{titre}</h2>
          </div>
        )}
        {content}
      </div>
    </div>
  );
}
