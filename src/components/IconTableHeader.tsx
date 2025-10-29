interface IconHeaderProps {
  src: string;
  alt?: string;
  size?: string; // height/width for img
  scale?: string; // optional tailwind scale
}

export default function IconHeader({
  src,
  alt = "",
  size = "h-[6vh] w-[6vh]",
  scale,
}: IconHeaderProps) {
  return (
    <div
      className={`flex items-center justify-center ${size} ${scale ?? ""}`}
      style={{ minHeight: "100%" }}
    >
      <img
        src={src}
        alt={alt}
        className={`object-contain`}
        style={{ display: "block" }} // removes inline img spacing
      />
    </div>
  );
}
