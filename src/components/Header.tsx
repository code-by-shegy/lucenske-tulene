interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
}

export default function Header({ title, onBack, rightSlot, className = "" }: HeaderProps) {
  return (
    <header
      className={`flex items-center justify-between px-4 py-3 bg-darkblue text-icywhite text-shadow-lg/50 ${className}`}
    >
      {onBack ? (
        <button onClick={onBack} className="text-icywhite text-lg font-bangers">
          ←
        </button>
      ) : (
        <span />
      )}
      <h1 className="text-lg font-bangers">{title}</h1>
      {rightSlot ?? <span />}
    </header>
  );
}