import type { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  className?: string;
}

export default function Page({ children, className = "" }: PageProps) {
  return (
    <div
      className={`bg-lightgrey flex min-h-screen flex-col px-4 ${className}`}
    >
      {children}
    </div>
  );
}
