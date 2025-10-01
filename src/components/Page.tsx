import type { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  className?: string;
}

export default function Page({ children, className = "" }: PageProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-lightgrey ${className}`}>
      {children}
    </div>
  );
}