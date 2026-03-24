# Evan Zerk Personal Landing Page

## Context

Building a minimal personal landing page for Evan Zeirk 

 Next.js + shadcn/ui. Single page, no routing.

## Design

- **Header area**: Name ("Evan Zerk"), one-line bio (placeholder), 3 links (placeholder)
- **Music grid**: 2x3 grid of square boxes. Each box = one track. Hover triggers audio playback of a local mp3 clip; mouse leave pauses.
- **Style**: Light minimal — white background, clean typography, subtle hover effects (e.g. slight scale/shadow on hover)

## Architecture

- `evanzierk.com/` — Next.js app (App Router)
- Single page: `app/page.tsx`
- `components/music-card.tsx` — reusable square card component w/ hover-play logic
- `public/audio/` — directory for 6 mp3 clips (user adds later)
- shadcn/ui for `Button`, `Card` components + Tailwind for layout

### Hover-to-play logic

- Each `MusicCard` holds a ref to an `HTMLAudioElement`
- `onMouseEnter` → `audio.play()`, `onMouseLeave` → `audio.pause(); audio.currentTime = 0`
- Audio src points to `/audio/track-1.mp3` through `/audio/track-6.mp3`
- Graceful fallback if file missing (no error thrown, just silent)

## Unresolved Questions

- None — proceeding with placeholders for bio, links, and audio files.

## Steps

1. Scaffold Next.js project in `evanzierk.com/` (`npx create-next-app@latest`)
2. Init shadcn/ui (`npx shadcn@latest init`)
3. Add shadcn `Card` and `Button` components
4. Build `app/page.tsx` — hero section (name, bio, links) + music grid
5. Build `components/music-card.tsx` — square card with hover-play audio logic
6. Create `public/audio/` directory (empty, for user to add clips)
7. Style everything with Tailwind — light minimal aesthetic
8. Test with `npm run dev`

## Verification

- `npm run dev` → page loads at localhost:3000
- Name, bio, links render correctly with placeholder text
- 6 square boxes display in 2x3 grid
- Hovering a box triggers audio play (once mp3s are added)
- Leaving a box stops audio and resets
- Page is responsive on mobile (grid collapses to single column)

