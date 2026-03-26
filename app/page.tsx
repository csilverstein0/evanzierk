import Link from "next/link";
import { HeroSection } from "@/components/hero-section";
import { MusicGrid } from "@/components/music-grid";
import { GlitchText } from "@/components/glitch-text";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <div className="flex grow items-center justify-center">
        <MusicGrid />
      </div>
      <footer className="flex items-baseline justify-between px-6 pb-6 sm:px-10 sm:pb-10">
        <GlitchText
          text="Sound Engineer"
          className="font-normal leading-none"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        />
        <GlitchText
          text="Composer"
          className="font-normal leading-none"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        />
        <Link
          href="/about"
          className="font-normal leading-none"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        >
          <GlitchText text="About" />
        </Link>
      </footer>
    </main>
  );
}
