import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  icon?: string;
  iconClassName?: string;
  inputClassName?: string;
}

export default function Input({
  label,
  className = "",
  icon,
  iconClassName,
  inputClassName,
  ...props
}: InputProps) {
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
        <input
          {...props}
          className={`border-mediumgrey focus:ring-darkblack text-darkblack placeholder-darkgrey w-full rounded-2xl border-3 text-lg focus:ring-2 focus:outline-none ${inputClassName}`}
        />
      </div>
    </div>
  );
}
