interface SwitchProps {
  mode: "plunge" | "shower";
  onChange: (mode: "plunge" | "shower") => void;
  icons: {
    plunge: string;
    shower: string;
  };
  className?: string;
}

export default function Switch({
  mode,
  onChange,
  icons,
  className = "",
}: SwitchProps) {
  const options = [
    { id: "plunge", icon: icons.plunge, alt: "Cold Plunge" },
    { id: "shower", icon: icons.shower, alt: "Cold Shower" },
  ] as const;

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="bg-dark2blue relative mx-auto flex aspect-[4/0.8] w-[70%] max-w-xs items-center rounded-full p-[1.5%] shadow-lg transition-all">
        {/* Sliding background */}
        <div
          className={`bg-mediumblue absolute top-[8%] bottom-[8%] w-[48%] rounded-full transition-all duration-300 ${
            mode === "plunge" ? "left-[2%]" : "left-[50%]"
          }`}
        />

        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className="z-10 flex flex-1 items-center justify-center transition-all"
            aria-pressed={mode === opt.id}
          >
            <div
              className={`flex h-[55%] w-[55%] items-center justify-center rounded-full transition-all duration-300 ${
                mode === opt.id ? "scale-105" : "opacity-70"
              }`}
            >
              <img
                src={opt.icon}
                alt={opt.alt}
                className="h-[60%] w-[60%] object-contain p-1"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
