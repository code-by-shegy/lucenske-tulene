import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  leftSlot?: ReactNode;   // e.g. back button or logo
  rightSlot?: ReactNode;  // e.g. profile icon
}

export default function Header({ title, leftSlot, rightSlot }: HeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-oceanblue text-white shadow-md">
      <div>{leftSlot}</div>
      <h1 className="text-lg font-bold">{title}</h1>
      <div>{rightSlot}</div>
    </header>
  );
}


