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
      <div className="px-6 pb-6 sm:px-10 sm:pb-10 sm:text-right">
        <Link
          href="/about"
          className="font-extralight leading-none"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}
        >
          <GlitchText text="About" />
        </Link>
      </div>
    </main>
  );
}
