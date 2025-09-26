import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-bangers text-deepblack">{label}</label>}
      <input
        {...props}
        className="px-4 py-2 font-bangers border border-mediumgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-darkblack"
      />
    </div>
  );
}
