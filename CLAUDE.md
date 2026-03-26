# evanzierk.com

Personal landing page for musician Evan Zerk. Built as a test of agentic coding tools.

## Stack
- Next.js 16.2.1 (App Router, static export)
- React 19.2.4
- Tailwind CSS v4 (CSS-first config, OKLCH colors)
- shadcn/ui v4.1.0 (base-nova style, @base-ui/react primitives)
- Font: Helvetica, Arial, sans-serif (system fonts, no web font)
- Hosted on GitHub Pages

## Commands
- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — static export to `out/`
- `npm run lint` — ESLint

## Key architecture decisions
- **Two pages** — `app/page.tsx` (home) and `app/about/page.tsx` (about, not yet created)
- **basePath is conditional** — empty in dev, `"/evanzierk"` in production (avoids redirect loop in dev). See `next.config.ts`.
- **Static export** — `output: "export"` in next.config.ts. No server-side features (no cookies, headers, ISR, server actions).
- **`'use client'` pushed deep** — only interactive components (music grid, glitch-text) need it. Page and hero section are server components.
- **Audio files** go in `public/audio/` (track-1.mp3 through track-3.mp3). Background images in `public/images/` (bg-1.jpg through bg-3.jpg).
- **Attribute-based CSS effects** — `[data-glitch="1"-"6"]` selectors in globals.css, following Symphony and Acid's pattern. 6 variants: 3 bg/color swaps (brown/dark brown/burnt orange), 3 with underline. Used by GlitchText component.
- **GlitchText component** — `components/glitch-text.tsx`. Client component that splits text into per-word `<span>`s with `data-glitch` attributes. rAF-driven hover animation with probabilistic apply/decay. Used on "Evan Zierk" heading, "Sound Engineer", "Composer", and "About" labels.
- **Audio progress line** — Gold vertical line in `music-grid.tsx` sweeps left-to-right during playback using Symphony and Acid's inset `box-shadow` trick. Uses ref-based DOM mutation (not React state) to avoid re-renders on each `timeupdate` event.

## GitHub Pages
- Repo: https://github.com/csilverstein0/evanzierk
- Live URL: https://csilverstein0.github.io/evanzierk/
- Deploy: GitHub Actions workflow in `.github/workflows/deploy.yml`, auto-deploys on push to `main`

## Workflow
- After finishing a PR or chunk of work, run `npm run dev` in the background and tell the user the dev server is ready for review at http://localhost:3000.

## Current state
- **Branch**: `main` (PRs 1-8 merged + bottom labels update)
- **PR 8**: ✅ Merged — Gold audio progress line, ref-based DOM mutation, .gitignore for raw assets
- **Bottom labels**: Added "Sound Engineer" and "Composer" alongside "About" in `<footer>`. Font weight bumped from extralight (200) to normal (400) across all text. Heading size reduced slightly.
- **Next up**: PR 9 (/about page)

## Plans
Detailed plans and research in `Plans/` directory:
- `pr-sequence.md` — PR breakdown with execution instructions and project state
- `research.md` — technology research report
- `plan-v2.md` — previous design plan
- `plan-v3.md` — current design plan (visual redesign + glitch effects)
- `symphonyandacid.md` — Symphony and Acid technical analysis
- `symphonyandacid-fonts.md` — Symphony and Acid font details

## Style guidelines
- When writing plans, be extremely concise. Sacrifice grammar for concision.
- Break plans into atomic chunks.
- End every plan with a numbered list of concrete steps.
- At the end of each plan, list unresolved questions.
