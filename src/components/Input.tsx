import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  htmlFor: string;
  label: string;
}

export default function Input({ htmlFor, label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold leading-none text-neutral-500"
      >
        {label}
      </label>
      <input
        {...props}
        id={htmlFor}
        className="ring-1 font-semibold ring-offset-0 focus-within:ring-offset-1 focus-within:ring-neutral-400 transition-all duration-150 ring-transparent outline-none border border-black/10 rounded-full h-9 bg-white px-4 text-neutral-600 text-sm"
      />
    </div>
  );
}
