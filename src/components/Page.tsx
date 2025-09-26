// src/components/Page.tsx
import type { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  className?: string; // 👈 allow optional className
}

export default function Page({ children, className = "" }: PageProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-icywhite ${className}`}>
      {children}
    </div>
  );
}
