# Evan Zerk Personal Landing Page — Updated Plan

## Context
Building a minimal personal landing page for Evan Zerk. Next.js + shadcn/ui. Single page, no routing. Hosted on **GitHub Pages** (static export). Two interactive features: hover over music boxes **plays audio** and **swaps the full-page background image**.

## Design
- **Header area**: Name ("Evan Zerk"), one-line bio (placeholder), 3 links (placeholder)
- **Music grid**: 2x3 grid of square boxes. Each box = one track.
- **On hover**: plays audio clip + fades full-page background to a track-specific image
- **On leave**: pauses audio, resets playback, fades background back to default
- **Style**: Light minimal — clean typography, subtle hover effects

## Architecture

```
evanzierk.com/
├── app/
│   ├── layout.tsx              # HTML shell, fonts, metadata, globals.css import
│   └── page.tsx                # Renders <HeroSection> (server) + <MusicGrid> (client)
├── components/
│   ├── hero-section.tsx        # Name, bio, links (server component)
│   ├── music-grid.tsx          # 'use client' — manages hover state, background, audio
│   └── music-card.tsx          # Individual square card (receives callbacks from grid)
├── public/
│   ├── audio/                  # 6 mp3 clips (user adds later): track-1.mp3 ... track-6.mp3
│   └── images/                 # 6 background images (placeholders): bg-1.jpg ... bg-6.jpg
├── next.config.mjs             # output: 'export', basePath, images: unoptimized
└── .github/workflows/deploy.yml # GitHub Actions → GitHub Pages
```

### Hover behavior — state architecture

State lives in `music-grid.tsx` (Client Component):
- `activeTrack: number | null` — which card is hovered (0–5 or null)
- `onMouseEnter(index)` → set activeTrack, play audio for that index, pause any other
- `onMouseLeave()` → set activeTrack to null, pause audio, reset currentTime

Background image rendering:
- `music-grid.tsx` renders a **fixed, full-screen `<div>`** behind the grid
- Background image = `public/images/bg-{activeTrack + 1}.jpg` when hovered, else default (white/none)
- CSS `transition: opacity 0.4s ease` for smooth fade between images
- Approach: stack all 6 images as absolute-positioned layers, toggle opacity based on activeTrack. Avoids image load flicker on first hover.

### Audio — same as before
- Each card's audio: `useRef<HTMLAudioElement>` array in music-grid
- Lazy init: create `new Audio()` on first hover per track
- `play().catch(() => {})` for autoplay policy
- Only one track plays at a time

### GitHub Pages — static export config

**`next.config.mjs`**:
```js
const nextConfig = {
  output: 'export',
  basePath: '/REPO_NAME',      // e.g. '/evanzierk.com' — matches GitHub repo name
  trailingSlash: true,
  images: { unoptimized: true }, // no server-side image optimization
}
```

**`.github/workflows/deploy.yml`**: Standard GitHub Pages deploy action
- Trigger: push to main
- Steps: checkout → setup node → npm ci → npm run build → upload `./out` → deploy-pages

**Asset paths**: All `<img>` and audio `src` must be relative or use `basePath`. Since we use `public/`, Next.js handles this via the `basePath` config automatically for static assets.

## Steps
1. Scaffold Next.js in `evanzierk.com/` (`npx create-next-app@latest`)
2. Configure `next.config.mjs`: `output: 'export'`, `basePath`, `images: { unoptimized: true }`
3. Init shadcn/ui + add Card, Button components
4. Create `public/audio/` (empty) and `public/images/` with 6 placeholder images
5. Build `components/hero-section.tsx` — name, bio, 3 links
6. Build `components/music-grid.tsx` — client component with activeTrack state, background layers, audio refs
7. Build `components/music-card.tsx` — square card, receives onMouseEnter/Leave from grid
8. Build `app/page.tsx` — composes hero + music grid
9. Style with Tailwind — light minimal, smooth background transitions
10. Add `.github/workflows/deploy.yml` for GitHub Pages deploy
11. Test locally with `npm run build && npx serve out`
12. Init git repo, push to GitHub, verify Pages deploy

## Verification
- `npm run dev` → page loads, all content renders
- `npm run build` succeeds (static export to `out/`)
- `npx serve out` → works at localhost with basePath
- Hovering a music box: plays audio (once mp3s added) AND background fades to track image
- Leaving a box: audio stops, background fades back
- Only one track plays at a time
- Responsive: grid collapses to 2-col or 1-col on mobile
- GitHub Actions deploys successfully to `username.github.io/repo-name`
