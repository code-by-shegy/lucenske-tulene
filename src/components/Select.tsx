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
  className,
  ...props
}: SelectProps) {
  return (
    <div className={"font-roboto flex w-full flex-col gap-1 ${className}"}>
      {label && (
        <label className="text-deepblack text-sm font-bold">{label}</label>
      )}
      <select
        {...props}
        //padding p-2 deleted and flex-1 used instead, to fix different height issue.
        className={`border-mediumgrey focus:ring-darkblack rounded-lg border-2 flex-1 focus:ring-2 focus:outline-none`}
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
