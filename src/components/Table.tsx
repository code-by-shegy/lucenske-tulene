import type { ReactNode } from "react";

interface TableProps {
  left: ReactNode;
  right?: ReactNode;
}

export default function Table({ left, right }: TableProps) {
  return (
    <div className="border-mediumgrey flex items-center justify-between border-b px-4 py-3 text-shadow-lg/50">
      <div className="text-deepblack">{left}</div>
      {right && <div className="text-red-600">{right}</div>}
    </div>
  );
}
