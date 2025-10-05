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
      className={`bg-darkblue text-icywhite flex items-center justify-between p-4 text-shadow-lg/50 ${className}`}
    >
      {leftSlot ?? <span />}
      <h1 className="font-bangers text-lg">{title}</h1>
      {rightSlot ?? <span />}
    </header>
  );
}
