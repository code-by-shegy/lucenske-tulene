// src/components/Select.tsx
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: number; label: string }[];
}

export default function Select({ label, options, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1 w-full font-roboto">
      {label && <label className="text-sm font-bold text-deepblack">{label}</label>}
      <select
        {...props}
        className={
          `p-2 border-2 border-mediumgrey rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-darkblack`}
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