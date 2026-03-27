"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MusicCard } from "@/components/music-card";
import { cn } from "@/lib/utils";

const basePath = process.env.NODE_ENV === "production" ? "/evanzierk" : "";

const tracks = [
  { title: "Bamboo Forest", audioSrc: `${basePath}/audio/track-1.mp3`, imageSrc: `${basePath}/images/bg-1.jpg` },
  { title: "Hawksnest 6am", audioSrc: `${basePath}/audio/track-2.mp3`, imageSrc: `${basePath}/images/bg-2.jpg` },
  { title: "Music", audioSrc: `${basePath}/audio/track-3.mp3`, imageSrc: `${basePath}/images/bg-3.jpg` },
];

interface MusicGridProps {
  onActiveChange?: (isActive: boolean) => void;
}

export function MusicGrid({ onActiveChange }: MusicGridProps) {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const activeRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  const handleTimeUpdate = useCallback((e: Event) => {
    const audio = e.currentTarget as HTMLAudioElement;
    if (audio.duration && progressRef.current) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progressRef.current.style.width = `${pct}%`;
      progressRef.current.style.boxShadow = "-1vw 0 0 0 #e6c040 inset";
    }
  }, []);

  const stopAudio = useCallback((audio: HTMLAudioElement, handler: (e: Event) => void) => {
    audio.removeEventListener("timeupdate", handler);
    audio.pause();
    audio.currentTime = 0;
  }, []);

  useEffect(() => {
    return () => {
      for (const audio of audioRefs.current) {
        if (audio) {
          audio.removeEventListener("timeupdate", handleTimeUpdate);
          audio.pause();
          audio.src = "";
        }
      }
    };
  }, [handleTimeUpdate]);

  const handleMouseEnter = useCallback((index: number) => {
    if (activeRef.current !== null) {
      const prev = audioRefs.current[activeRef.current];
      if (prev) stopAudio(prev, handleTimeUpdate);
    }

    if (!audioRefs.current[index]) {
      audioRefs.current[index] = new Audio(tracks[index].audioSrc);
    }

    const audio = audioRefs.current[index]!;
    audio.removeEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.play().catch(() => {});
    activeRef.current = index;

    if (progressRef.current) {
      progressRef.current.style.width = "0%";
      progressRef.current.style.boxShadow = "-1vw 0 0 0 #e6c040 inset";
    }
    setActiveTrack(index);
    onActiveChangeRef.current?.(true);
  }, [handleTimeUpdate, stopAudio]);

  const handleMouseLeave = useCallback(() => {
    if (activeRef.current !== null) {
      const audio = audioRefs.current[activeRef.current];
      if (audio) stopAudio(audio, handleTimeUpdate);
    }
    activeRef.current = null;

    if (progressRef.current) {
      progressRef.current.style.width = "0%";
      progressRef.current.style.boxShadow = "none";
    }
    setActiveTrack(null);
    onActiveChangeRef.current?.(false);
  }, [handleTimeUpdate, stopAudio]);

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

      {/* Progress line — inset box-shadow on a width-driven span (Symphony and Acid technique) */}
      <span
        ref={progressRef}
        className="pointer-events-none fixed inset-0 z-[2] block h-full"
        style={{ width: "0%", boxShadow: "none" }}
      />

      <div className="flex flex-col items-center gap-4 px-4 sm:flex-row sm:justify-center">
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
    </>
  );
}
