import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="bg-mediumgrey w-full rounded-xl p-4 shadow-md">
      {children}
    </div>
  );
}
