import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
}: ButtonProps) {
  const baseStyles = `font-bangers text-shadow-lg/50
                      rounded-xl transition-colors border-2`;
  // focus:outline-none focus:ring-2 focus:ring-offset-2

  const variants: Record<ButtonVariant, string> = {
    primary: `bg-darkblue text-icywhite hover:bg-mediumblue border-darkblue`,
    secondary: `bg-darkgrey text-icywhite hover:bg-mediumgrey border-darkgrey`,
    danger: `bg-red-500 text-icywhite hover:bg-red-600 border-red-500`,
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "p-2 text-sm",
    md: "p-3 text-base",
    lg: "p-4 text-lg",
  };

  const width = fullWidth ? "w-full" : "inline-block";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${disabledStyles}`}
    >
      {children}
    </button>
  );
}
