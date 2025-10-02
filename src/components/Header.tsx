import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

export default function Header({
  title,
  onBack,
  rightSlot,
  className = "",
}: HeaderProps) {
  return (
    <header
      className={`bg-darkblue text-icywhite flex items-center justify-between px-4 py-3 text-shadow-lg/50 ${className}`}
    >
      {onBack ? (
        <button onClick={onBack} className="text-icywhite">
          <ArrowLeft size="1em" strokeWidth={4} />
        </button>
      ) : (
        <span />
      )}
      <h1 className="font-bangers text-lg">{title}</h1>
      {rightSlot ?? <span />}
    </header>
  );
}
