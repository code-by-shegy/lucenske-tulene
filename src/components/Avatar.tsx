interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string; // e.g. "S" for "Shegy"
  size?: "sm" | "md" | "lg";
}

export default function Avatar({
  src,
  alt,
  fallback = "?",
  size = "md",
}: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
  };

  return (
    <div
      className={`bg-oceanblue flex items-center justify-center overflow-hidden rounded-full text-white ${sizes[size]}`}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="font-bangers">{fallback}</span>
      )}
    </div>
  );
}
