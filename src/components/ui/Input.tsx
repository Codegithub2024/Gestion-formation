import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {}
interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {}

export default function Input({ ...props }: InputProps) {
  return (
    <div className="grid flex-1 gap-1.5">
      <label
        htmlFor={props.name}
        className="text-sm leading-none capitalize text-neutral-800"
      >
        {props.name}
        {props.required ? <span className="text-red-500 ml-0.5">*</span> : null}
      </label>
      <input {...props} id={props.name} className="input" />
    </div>
  );
}

export function Select({ ...props }: SelectProps) {
  return (
    <div className="grid gap-1.5 flex-1">
      <label
        htmlFor={props.name}
        className="text-sm leading-none capitalize text-neutral-800"
      >
        {props.name}
        {props.required ? <span className="text-red-500 ml-0.5">*</span> : null}
      </label>
      <select {...props} id={props.name} className="input">
        {props.children}
      </select>
    </div>
  );
}

export function Textarea({ ...props }: TextareaProps) {
  return (
    <div className="grid gap-1.5 flex-1">
      <label
        htmlFor={props.name}
        className="text-sm leading-none capitalize text-neutral-800"
      >
        {props.name}
        {props.required ? <span className="text-red-500 ml-0.5">*</span> : null}
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
