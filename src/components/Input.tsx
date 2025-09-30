import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full font-roboto">
      {label && <label className="text-sm font-bold text-deepblack">{label}</label>}
      <input
        {...props}
        className={
          `px-4 py-2 border-2 border-mediumgrey rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-darkblack`}
      />
    </div>
  );
}
