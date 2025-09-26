import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="bg-mediumgrey rounded-xl shadow-md p-4 w-full">
      {children}
    </div>
  );
}
