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
  className?: string;
  iconOnly?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  className = "",
  iconOnly = false,
}: ButtonProps) {
  const baseStyles = `font-bangers ${className} text-shadow-lg/50
                      rounded-xl transition-colors border-2`;
  // focus:outline-none focus:ring-2 focus:ring-offset-2

  const variants: Record<ButtonVariant, string> = {
    primary: `bg-dark2blue text-icywhite hover:bg-mediumblue border-dark2blue`,
    secondary: `bg-mediumblue text-icywhite hover:bg-lightblue border-mediumblue`,
    danger: `bg-red-500 text-icywhite hover:bg-red-600 border-red-500`,
  };

  const sizes: Record<ButtonSize, string> = {
    sm: iconOnly ? "p-2" : "p-2 text-sm",
    md: iconOnly ? "p-3" : "p-3 text-base",
    lg: iconOnly ? "p-4" : "p-4 text-lg",
  };

  const width = fullWidth ? "w-full" : "inline-block";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  // Extra styles for icon-only buttons
  const iconOnlyStyles = iconOnly ? "flex items-center justify-center" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${disabledStyles} ${iconOnlyStyles}`}
    >
      {children}
    </button>
  );
}
