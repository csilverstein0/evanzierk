"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { HeroSection } from "@/components/hero-section";
import { MusicGrid } from "@/components/music-grid";
import { GlitchText } from "@/components/glitch-text";

const FOOTER_HIDE_DELAY = 300;

export default function Home() {
  const [footerHidden, setFooterHidden] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleActiveChange = useCallback((isActive: boolean) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isActive) {
      timerRef.current = setTimeout(() => setFooterHidden(true), FOOTER_HIDE_DELAY);
    } else {
      setFooterHidden(false);
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <div className="flex grow items-center justify-center">
        <MusicGrid onActiveChange={handleActiveChange} />
      </div>
      <footer
        className={`flex items-baseline justify-between px-6 pb-6 sm:px-10 sm:pb-10 ${footerHidden ? "invisible" : ""}`}
      >
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
