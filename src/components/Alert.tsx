import type { FC, ReactNode } from "react";

type AlertType = "success" | "warning" | "error";

interface AlertProps {
  type: AlertType;
  title?: string;
  children: ReactNode;
  className?: string;
}

const variants = {
  success: {
    bg: "bg-green-100",
    border: "border-green-200",
    title: "text-green-800",
    text: "text-green-700",
    icon: "✅",
  },
  warning: {
    bg: "bg-yellow-100",
    border: "border-yellow-200",
    title: "text-yellow-800",
    text: "text-yellow-700",
    icon: "⚠️",
  },
  error: {
    bg: "bg-red-100",
    border: "border-red-200",
    title: "text-red-800",
    text: "text-red-700",
    icon: "❌",
  },
};

const Alert: FC<AlertProps> = ({ type, title, children, className }) => {
  const color = variants[type];

  return (
    <div
      className={`w-full rounded-xl border p-3 shadow-lg ${color.bg} ${color.border} ${className || ""}`}
    >
      {title && (
        <h2 className={`font-bangers mb-3 text-center text-2xl ${color.title}`}>
          {color.icon} {title}
        </h2>
      )}

      <div className={`font-roboto text-sm ${color.text}`}>{children}</div>
    </div>
  );
};

export default Alert;
