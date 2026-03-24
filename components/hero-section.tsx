import { Button } from "@/components/ui/button";

const links = [
  { label: "Spotify", href: "https://spotify.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:py-32">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
        Evan Zerk
      </h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Musician, producer, and artist crafting sounds that move.
      </p>
      <div className="flex gap-3">
        {links.map((link) => (
          <Button
            key={link.label}
            variant="outline"
            size="lg"
            render={
              <a href={link.href} target="_blank" rel="noopener noreferrer" />
            }
          >
            {link.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
