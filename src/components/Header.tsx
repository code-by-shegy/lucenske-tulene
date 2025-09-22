import { ArrowLeft } from "lucide-react"; // lightweight icon lib

type HeaderProps = {
  title: string;
  onBack: () => void;
};

export default function Header({ title, onBack }: HeaderProps) {
  return (
    <div className="flex items-center px-4 py-3 bg-sky-600 text-white shadow-md">
      <button
        onClick={onBack}
        className="mr-3 p-1 rounded hover:bg-sky-500 transition"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
}