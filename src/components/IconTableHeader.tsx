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
    <div className={`flex aspect-square h-full items-center justify-center`}>
      <img src={src} alt={alt} className={`object-contain ${size}`} />
    </div>
  );
}
