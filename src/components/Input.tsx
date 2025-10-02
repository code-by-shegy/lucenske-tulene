import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="font-roboto flex w-full flex-col gap-1">
      {label && (
        <label className="text-deepblack text-sm font-bold">{label}</label>
      )}
      <input
        {...props}
        className={`border-mediumgrey focus:ring-darkblack rounded-lg border-2 p-2 focus:ring-2 focus:outline-none`}
      />
    </div>
  );
}
