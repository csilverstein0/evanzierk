import { HeroSection } from "@/components/hero-section";
import { MusicGrid } from "@/components/music-grid";

export default function Home() {
  return (
    <main className="flex grow flex-col">
      <HeroSection />
      <MusicGrid />
    </main>
  );
}
