// src/components/Select.tsx
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: number; label: string }[];
  className?: string;
}

export default function Select({
  label,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className={`font-roboto ${className} flex w-full flex-col gap-1`}>
      {label && (
        <label className={`text-deepblack text-sm font-bold`}>{label}</label>
      )}
      <select
        {...props}
        className={`border-mediumgrey focus:ring-darkblack appearance-none rounded-lg border-2 p-1 focus:ring-2 focus:outline-none`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
