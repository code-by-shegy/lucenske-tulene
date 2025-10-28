import type { ReactNode } from "react";

interface TableProps {
  headers: ReactNode[];
  rows: ReactNode[][];
  rowClassNames?: string[];
  className?: string;
  title?: string;
  titleClassName?: string;
}

export default function Table({
  headers,
  rows,
  rowClassNames = [],
  className = "",
  title,
  titleClassName,
}: TableProps) {
  return (
    <div className={`overflow-x-auto`}>
      {title && (
        <h2
          className={`font-bangers text-darkblack mb-2 text-lg ${titleClassName}`}
        >
          {title}
        </h2>
      )}
      <table
        className={`w-full border-separate border-spacing-0 text-left ${className}`}
      >
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className={`text-icywhite bg-dark2blue font-roboto p-2 text-sm text-shadow-lg/25 ${
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
            <tr key={rowIndex}>
              {cols.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`text-darkblack font-roboto border-mediumgrey hover:bg-lightblue/10 border-t p-2 text-sm transition-colors ${
                    rowClassNames[rowIndex] ?? "bg-icywhite"
                  } ${rowIndex === rows.length - 1 && colIndex === 0 ? "rounded-bl-2xl" : ""} ${
                    rowIndex === rows.length - 1 && colIndex === cols.length - 1
                      ? "rounded-br-2xl"
                      : ""
                  }`}
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
