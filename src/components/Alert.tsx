import type { FC } from "react";

type AlertType = "success" | "warning" | "error";

interface AlertProps {
  type?: AlertType; // default: success
  children: React.ReactNode;
  className?: string;
}

const colors = {
  success: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  warning: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
  },
  error: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
};

const Alert: FC<AlertProps> = ({ type = "success", children, className }) => {
  const color = colors[type];

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm shadow-md ${color.bg} ${color.text} ${color.border} ${className}`}
    >
      {children}
    </div>
  );
};

export default Alert;
