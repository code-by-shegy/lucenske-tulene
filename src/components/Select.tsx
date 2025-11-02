import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: number; label: string }[];
  className?: string;
  icon?: string;
  iconClassName?: string;
  selectClassName?: string;
}

export default function Select({
  label,
  options,
  className = "",
  icon,
  iconClassName = "",
  selectClassName = "",
  ...props
}: SelectProps) {
  return (
    <div className={`font-roboto ${className} flex w-full flex-col`}>
      {label && (
        <label className="text-deepblack mb-1 text-sm font-bold">{label}</label>
      )}

      <div className="relative w-full">
        {icon && (
          <div className="absolute top-0 bottom-0 ml-3 flex items-center">
            <img
              src={icon}
              alt=""
              className={`h-[60%] w-auto object-contain ${iconClassName}`}
            />
          </div>
        )}

        <select
          {...props}
          className={`border-mediumgrey focus:ring-darkblack text-darkblack w-full appearance-none rounded-2xl border-3 text-lg focus:ring-2 focus:outline-none ${selectClassName}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
