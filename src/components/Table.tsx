import type { ReactNode } from "react";

interface TableProps {
  headers: string[];
  rows: ReactNode[][];
  className?: string;
}

export default function Table({ headers, rows, className = "" }: TableProps) {
  return (
    <div className={`overflow-x-auto p-4`}>
      <table className={`w-full border-collapse text-left ${className}`}>
        <thead>
          <tr className="bg-darkblack text-icywhite font-roboto text-sm">
            {headers.map((header, i) => (
              <th
                key={i}
                //Rounded corners only on the first and last header cells. Padding for all the same.
                className={`p-3 ${
                  i === 0
                    ? "rounded-tl-2xl"
                    : i === headers.length - 1
                      ? "rounded-tr-2xl"
                      : ""
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((cols, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-icywhite border-mediumgrey hover:bg-lightblue/10 border-t transition-colors"
            >
              {cols.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="text-darkblack font-roboto text-md p-3"
                >
                  {col}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
