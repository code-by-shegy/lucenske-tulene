import type { ReactNode } from "react";

interface TableProps {
  left: ReactNode;
  right?: ReactNode;
}

export default function Table({ left, right }: TableProps) {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
      <div className="text-deepblack">{left}</div>
      {right && <div className="text-gray-600">{right}</div>}
    </div>
  );
}