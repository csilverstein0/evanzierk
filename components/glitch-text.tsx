"use client";

import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  tag?: "h1" | "a" | "span";
  className?: string;
  style?: CSSProperties;
  highlightRange?: [number, number];
  href?: string;
}

const GLITCH_MAX = 7;
const APPLY_CHANCE = 0.3;
const DECAY_CHANCE = 0.12;
const FRAME_INTERVAL = 80;

export function GlitchText({
  text,
  tag: Tag = "span",
  className,
  style,
  highlightRange,
  href,
}: GlitchTextProps) {
  const words = useMemo(() => text.split(" "), [text]);
  const [glitchStates, setGlitchStates] = useState<number[]>(() =>
    words.map(() => 0)
  );
  const [hasBeenHovered, setHasBeenHovered] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const animate = useCallback(
    (time: number) => {
      if (time - lastFrameRef.current < FRAME_INTERVAL) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameRef.current = time;

      let shouldStop = false;

      setGlitchStates((prev) => {
        const next = [...prev];
        let changed = false;
        let anyActive = false;

        for (let i = 0; i < next.length; i++) {
          if (isHoveredRef.current) {
            if (next[i] === 0 && Math.random() < APPLY_CHANCE) {
              next[i] = Math.ceil(Math.random() * GLITCH_MAX);
              changed = true;
            }
            anyActive = true;
          } else {
            if (next[i] !== 0 && Math.random() < DECAY_CHANCE) {
              next[i] = 0;
              changed = true;
            }
            if (next[i] !== 0) {
              anyActive = true;
            }
          }
        }

        if (!anyActive && !isHoveredRef.current) {
          shouldStop = true;
          return prev.every((v) => v === 0) ? prev : prev.map(() => 0);
        }

        return changed ? next : prev;
      });

      if (shouldStop) {
        rafRef.current = null;
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [words]
  );

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    setHasBeenHovered(true);
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
  }, []);

  let charOffset = 0;
  const content = words.map((word, wi) => {
    const wordStart = charOffset;
    charOffset += word.length + 1;

    const isHighlighted =
      highlightRange &&
      wordStart < highlightRange[1] &&
      wordStart + word.length > highlightRange[0];

    const wordEl = (
      <span
        key={wi}
        data-glitch={glitchStates[wi] || 0}
        className={cn(
          "text-foreground",
          isHighlighted && !hasBeenHovered && "bg-[#6b5d4f] text-[#f5f0e8]"
        )}
        style={{ transition: "background 0.15s, color 0.15s" }}
      >
        {word}
      </span>
    );

    if (wi < words.length - 1) {
      return [wordEl, " "];
    }
    return wordEl;
  });

  const props = {
    className,
    style,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...(Tag === "a" ? { href } : {}),
  };

  return <Tag {...props}>{content}</Tag>;
}
