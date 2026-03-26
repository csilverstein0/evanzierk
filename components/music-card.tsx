import { cn } from "@/lib/utils";

interface MusicCardProps {
  title: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MusicCard({
  title,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: MusicCardProps) {
  return (
    <div
      className={cn(
        "cursor-pointer border border-foreground px-8 py-3 text-center transition-all duration-200",
        isActive && "scale-105 shadow-lg"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className="text-sm font-normal">{title}</p>
    </div>
  );
}
