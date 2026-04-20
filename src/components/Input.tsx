import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  htmlFor: string;
  label: string;
}

export default function Input({ htmlFor, label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium leading-none text-neutral-700">
        {label}
      </label>
      <input
        {...props}
        id={htmlFor}
        className="ring-1 ring-offset-0 focus-within:ring-offset-2 focus-within:ring-primary-amber transition-all duration-150 ring-transparent outline-none border border-black/10 rounded-lg h-9 bg-white px-3 text-sm"
      />
    </div>
  );
}
