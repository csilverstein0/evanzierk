import { Card, CardContent } from "@/components/ui/card";
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
    <Card
      className={cn(
        "aspect-square cursor-pointer transition-all duration-200",
        isActive && "scale-105 shadow-lg"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardContent className="flex grow items-center justify-center">
        <p className="text-base font-medium">{title}</p>
      </CardContent>
    </Card>
  );
}
