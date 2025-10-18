interface HeaderProps {
  title: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
}

export default function Header({
  title,
  leftSlot,
  rightSlot,
  className = "",
}: HeaderProps) {
  return (
    <header
      className={`bg-dark2blue text-icywhite -mx-4 flex w-screen items-center justify-between p-3 text-shadow-lg/50 ${className}`} //-mx-4 cancels page padding.
    >
      {leftSlot ?? <span />}
      <h1 className="font-bangers text-2xl sm:text-3xl md:text-4xl">{title}</h1>
      {rightSlot ?? <span />}
    </header>
  );
}
