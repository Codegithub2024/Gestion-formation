import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {}
interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {}

export default function Input({ ...props }: InputProps) {
  return (
    <div className="grid gap-1 flex-1">
      <label
        htmlFor={props.name}
        className="text-xs capitalize font-semibold text-neutral-500"
      >
        {props.name}
      </label>
      <input {...props} id={props.name} className="input" />
    </div>
  );
}

export function Select({ ...props }: SelectProps) {
  return (
    <div className="grid gap-1 flex-1">
      <label
        htmlFor={props.name}
        className="text-xs capitalize font-semibold text-neutral-500"
      >
        {props.name}
      </label>
      <select {...props} id={props.name} className="input">
        {props.children}
      </select>
    </div>
  );
}

export function Textarea({ ...props }: TextareaProps) {
  return (
    <div className="grid gap-1 flex-1">
      <label
        htmlFor={props.name}
        className="text-xs capitalize font-semibold text-neutral-500"
      >
        {props.name}
      </label>
      <textarea
        {...props}
        id={props.name}
        className="input py-2 resize-none"
        rows={5}
      />
    </div>
  );
}
