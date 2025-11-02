interface IconHeaderProps {
  src: string;
  alt?: string;
  size?: string; // height/width for img
}

export default function IconHeader({
  src,
  alt = "",
  size = "",
}: IconHeaderProps) {
  return (
    <div
      className={`flex items-center justify-center`}
      style={{ height: "100%", minHeight: "4vh" }}
    >
      <img
        src={src}
        alt={alt}
        className={`object-contain ${size}`}
        style={{ display: "block" }} // removes inline img spacing
      />
    </div>
  );
}
