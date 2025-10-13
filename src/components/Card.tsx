import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-icywhite w-full rounded-2xl p-3 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
