# PR Sequence — evanzierk.com

## Overview
5 sequential PRs. Each builds on the last. Each is independently shippable — the site works (even if incomplete) after every merge.

---

## PR 1: Project Scaffolding
**Branch**: `feat/scaffolding`
**Base**: `main`

### Scope
- Scaffold Next.js project (App Router, TypeScript, Tailwind CSS, ESLint)
- Init shadcn/ui, add `Card` and `Button` components
- Configure `next.config.mjs` for GitHub Pages static export (`output: 'export'`, `basePath`, `trailingSlash`, `images: { unoptimized: true }`)
- Verify `npm run build` produces `out/` directory successfully
- Preserve existing `Plans/` directory and `claude.md`

### Includes
- `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`
- `app/layout.tsx` with basic metadata and global styles
- `app/page.tsx` with a minimal "Hello World" placeholder
- `app/globals.css` with Tailwind + shadcn theme tokens
- `components/ui/card.tsx`, `components/ui/button.tsx` (shadcn)
- `lib/utils.ts` (shadcn `cn` utility)
- `components.json` (shadcn config)

### Excludes
- No custom components yet (hero, music grid, music card)
- No `public/audio/` or `public/images/` directories
- No GitHub Actions workflow
- No styling beyond shadcn defaults

### Execution instructions
1. Move `Plans/` and `claude.md` to a temp location
2. Run `npx create-next-app@latest evanzierk.com --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm`
3. Move `Plans/` and `claude.md` back into the project
4. Edit `next.config.mjs`: add `output: 'export'`, `basePath: '/evanzierk.com'`, `trailingSlash: true`, `images: { unoptimized: true }`
5. Run `npx shadcn@latest init` (accept defaults, CSS variables: yes)
6. Run `npx shadcn@latest add card button`
7. Run `npm run build` — confirm `out/` directory is created
8. Init git repo, create `main` branch, commit scaffolding
9. Create `feat/scaffolding` branch (or commit directly to main since this is the first PR)

### Verification
- `npm run build` exits 0 and produces `out/index.html`
- `npx serve out` loads a page at localhost

---

## PR 2: Hero Section
**Branch**: `feat/hero-section`
**Base**: `main` (after PR 1 merged)

### Scope
- Build the hero section: Evan Zerk's name, one-line bio, and 3 external links
- Light minimal styling with Tailwind

### Includes
- `components/hero-section.tsx` — server component with:
  - Large heading: "Evan Zerk"
  - Subtitle/bio line (placeholder text)
  - 3 `Button` components as external links (placeholder URLs, `variant="outline"`)
- Update `app/page.tsx` to render `<HeroSection />`
- Tailwind styling: centered layout, clean typography, appropriate spacing

### Excludes
- No music grid, no audio, no background images
- No interactivity — this is entirely a server component

### Execution instructions
1. Create `components/hero-section.tsx` with name, bio, 3 links using shadcn `Button`
2. Update `app/page.tsx` to import and render `<HeroSection />`
3. Style with Tailwind: vertically centered or top-centered, generous whitespace, responsive text sizes
4. Run `npm run build` — confirm success
5. Commit and open PR

### Verification
- Page displays name, bio, and 3 clickable link buttons
- Responsive: looks good on mobile and desktop
- `npm run build` succeeds

---

## PR 3: Music Grid with Hover Audio
**Branch**: `feat/music-grid`
**Base**: `main` (after PR 2 merged)

### Scope
- Build the 2x3 grid of square music cards
- Implement hover-to-play audio using `HTMLAudioElement`
- Create `public/audio/` directory for mp3 files

### Includes
- `components/music-card.tsx` — square card component, accepts `title`, `audioSrc`, `onMouseEnter`, `onMouseLeave` props
- `components/music-grid.tsx` — `'use client'` component that:
  - Defines track data array (6 tracks with title + audio path)
  - Manages `activeTrack` state (`number | null`)
  - Holds audio refs (`useRef<(HTMLAudioElement | null)[]>`)
  - On hover: pauses any playing track, plays hovered track's audio
  - On leave: pauses audio, resets `currentTime`, clears `activeTrack`
  - Lazy-inits `new Audio()` on first hover per track
  - `.catch()` on all `play()` calls for autoplay policy
- `public/audio/.gitkeep` — empty directory, user adds mp3s later
- Update `app/page.tsx` to render `<MusicGrid />` below `<HeroSection />`
- Styling: 2x3 grid on desktop, 2-col on tablet, 1-col on mobile. Square aspect ratio via `aspect-square`. Subtle scale/shadow on hover.

### Excludes
- No background image swap — that's PR 4
- No actual audio files — just the infrastructure
- `music-grid.tsx` does NOT render background layers yet

### Execution instructions
1. Create `public/audio/` with a `.gitkeep`
2. Create `components/music-card.tsx`: square card using shadcn `Card`, `aspect-square`, accepts hover callbacks
3. Create `components/music-grid.tsx`:
   - `'use client'` directive
   - Track data: `[{ title: "Track 1", audioSrc: "/audio/track-1.mp3" }, ...]`
   - `useState<number | null>(null)` for activeTrack
   - `useRef<(HTMLAudioElement | null)[]>([])` for audio instances
   - `handleMouseEnter(index)`: pause all, lazy-init audio, play, set activeTrack
   - `handleMouseLeave()`: pause current, reset, clear activeTrack
   - Render 6 `<MusicCard>` in a grid
4. Update `app/page.tsx` to include `<MusicGrid />`
5. Run `npm run build` — confirm success
6. Commit and open PR

### Verification
- 6 square cards display in a 2x3 grid
- Hovering a card shows visual feedback (scale/shadow)
- If mp3 files are added to `public/audio/`, hover plays audio and leave stops it
- Only one track plays at a time
- No console errors when audio files are missing
- `npm run build` succeeds

---

## PR 4: Background Image Swap on Hover
**Branch**: `feat/background-images`
**Base**: `main` (after PR 3 merged)

### Scope
- Add full-screen background image that changes when hovering a music card
- Create `public/images/` with 6 placeholder images
- Smooth crossfade transitions between backgrounds

### Includes
- `public/images/bg-1.jpg` through `bg-6.jpg` — 6 placeholder images (solid color rectangles or gradient PNGs generated via code)
- Update track data in `music-grid.tsx` to include `imageSrc` per track
- Add background layer rendering to `music-grid.tsx`:
  - Fixed, full-screen container behind the grid (`fixed inset-0 -z-10`)
  - 6 stacked `<div>` layers, each with `background-image` set to a track's image
  - All layers `opacity-0` by default
  - Active layer gets `opacity-1` based on `activeTrack` state
  - CSS `transition: opacity 0.4s ease` on all layers
- Ensure text/content remains readable over background images (slight overlay or text shadow)

### Excludes
- No changes to audio logic — that's already done in PR 3
- No changes to hero section
- No real photography — placeholders only

### Execution instructions
1. Generate 6 placeholder images (solid colors or gradients) and save to `public/images/bg-1.jpg` through `bg-6.jpg`. Can use a simple script or create colored SVGs.
2. Update track data in `music-grid.tsx`: add `imageSrc: "/images/bg-1.jpg"` etc.
3. Add background layer JSX to `music-grid.tsx`:
   - Before the grid, render a fixed full-screen container
   - Map over tracks to create 6 absolute-positioned divs with `background-image`, `background-size: cover`, `background-position: center`
   - Conditionally set `opacity-100` when `activeTrack === index`
   - Add `transition-opacity duration-400 ease-in-out` classes
4. Add a subtle semi-transparent overlay or adjust text colors so content stays readable
5. Run `npm run build` — confirm success
6. Commit and open PR

### Verification
- Default state: white/no background
- Hovering a card: background fades in with the track's image
- Leaving a card: background fades back to default
- Transitions are smooth (no flicker, no image loading delay)
- Text remains readable over all background images
- Audio still works correctly (no regressions)
- `npm run build` succeeds

---

## PR 5: GitHub Actions Deploy Workflow
**Branch**: `feat/github-pages-deploy`
**Base**: `main` (after PR 4 merged)

### Scope
- Add GitHub Actions workflow to auto-deploy to GitHub Pages on push to `main`

### Includes
- `.github/workflows/deploy.yml`:
  ```yaml
  name: Deploy to GitHub Pages
  on:
    push:
      branches: [main]
    workflow_dispatch:
  permissions:
    contents: read
    pages: write
    id-token: write
  concurrency:
    group: "pages"
    cancel-in-progress: false
  jobs:
    deploy:
      environment:
        name: github-pages
        url: ${{ steps.deployment.outputs.page_url }}
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with:
            node-version: '20'
            cache: 'npm'
        - run: npm ci
        - run: npm run build
        - uses: actions/configure-pages@v5
        - uses: actions/upload-pages-artifact@v3
          with:
            path: './out'
        - id: deployment
          uses: actions/deploy-pages@v4
  ```
- Add `out/` to `.gitignore` if not already there

### Excludes
- No code changes to components or pages
- No DNS/domain configuration
- Does not push to remote or enable Pages — user does that manually in GitHub repo settings

### Execution instructions
1. Create `.github/workflows/` directory
2. Write `deploy.yml` with the workflow above
3. Ensure `out/` is in `.gitignore`
4. Run `npm run build` one final time to confirm nothing is broken
5. Commit and open PR

### Verification
- `npm run build` still succeeds
- `.github/workflows/deploy.yml` has valid YAML syntax
- After merging and pushing to GitHub: user enables Pages in repo settings (Settings → Pages → Source: GitHub Actions), and the workflow deploys on next push to `main`

---

## Summary

| PR | Branch | Scope | Depends on |
|----|--------|-------|------------|
| 1 | `feat/scaffolding` | Next.js + shadcn + GitHub Pages config | — |
| 2 | `feat/hero-section` | Name, bio, 3 links | PR 1 |
| 3 | `feat/music-grid` | 2x3 grid + hover audio | PR 2 |
| 4 | `feat/background-images` | Full-screen background swap on hover | PR 3 |
| 5 | `feat/github-pages-deploy` | GitHub Actions workflow | PR 4 |
