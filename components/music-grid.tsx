"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MusicCard } from "@/components/music-card";
import { cn } from "@/lib/utils";

const tracks = [
  { title: "Track 1", audioSrc: "/audio/track-1.mp3", imageSrc: "/images/bg-1.svg" },
  { title: "Track 2", audioSrc: "/audio/track-2.mp3", imageSrc: "/images/bg-2.svg" },
  { title: "Track 3", audioSrc: "/audio/track-3.mp3", imageSrc: "/images/bg-3.svg" },
  { title: "Track 4", audioSrc: "/audio/track-4.mp3", imageSrc: "/images/bg-4.svg" },
  { title: "Track 5", audioSrc: "/audio/track-5.mp3", imageSrc: "/images/bg-5.svg" },
  { title: "Track 6", audioSrc: "/audio/track-6.mp3", imageSrc: "/images/bg-6.svg" },
];

export function MusicGrid() {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const activeRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      for (const audio of audioRefs.current) {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      }
    };
  }, []);

  const handleMouseEnter = useCallback((index: number) => {
    // Pause the currently playing track
    if (activeRef.current !== null) {
      const prev = audioRefs.current[activeRef.current];
      if (prev) {
        prev.pause();
        prev.currentTime = 0;
      }
    }

    // Lazy-init audio on first hover
    if (!audioRefs.current[index]) {
      audioRefs.current[index] = new Audio(tracks[index].audioSrc);
    }

    audioRefs.current[index]!.play().catch(() => {});
    activeRef.current = index;
    setActiveTrack(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (activeRef.current !== null) {
      const audio = audioRefs.current[activeRef.current];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
    activeRef.current = null;
    setActiveTrack(null);
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-10">
        {tracks.map((track, index) => (
          <div
            key={track.title}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-400 ease-in-out",
              activeTrack === index ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundImage: `url(${track.imageSrc})` }}
          />
        ))}
        {/* Semi-transparent overlay for text readability */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-400 ease-in-out",
            activeTrack !== null ? "bg-black/30 opacity-100" : "opacity-0"
          )}
        />
      </div>

      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track, index) => (
            <MusicCard
              key={track.title}
              title={track.title}
              isActive={activeTrack === index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
      </section>
    </>
  );
}
