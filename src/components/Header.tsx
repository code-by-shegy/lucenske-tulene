import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  className?: string;
}

export default function Header({ title, onBack, className = "" }: HeaderProps) {
  return (
    <header
      className={`flex items-center justify-between px-4 py-3 bg-white shadow ${className}`}
    >
      {onBack ? (
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
      ) : (
        <div className="w-8" />
      )}
      <h1 className="text-lg font-bold text-gray-800">{title}</h1>
      <div className="w-8" />
    </header>
  );
}
