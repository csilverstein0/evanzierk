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
- **`'use client'` pushed deep** — only interactive components (music grid, future glitch-text) need it. Page and hero section are server components.
- **Audio files** go in `public/audio/` (track-1.mp3 through track-3.mp3). Background images in `public/images/` (bg-1.jpg through bg-3.jpg).
- **Attribute-based CSS effects** — `[data-glitch]` and `[data-decor]` selectors in globals.css, following Symphony and Acid's pattern. Used by future GlitchText component.

## GitHub Pages
- Repo: https://github.com/csilverstein0/evanzierk
- Live URL: https://csilverstein0.github.io/evanzierk/
- Deploy: GitHub Actions workflow in `.github/workflows/deploy.yml`, auto-deploys on push to `main`

## Workflow
- After finishing a PR or chunk of work, run `npm run dev` in the background and tell the user the dev server is ready for review at http://localhost:3000.

## Current state
- **Branch**: `feat/visual-redesign` (PR 6 in progress, not yet committed)
- **What's done in PR 6**: color palette (cream/brown), layout redesign (name top-left, cards centered row, About bottom-corner), font matched to Symphony and Acid (Helvetica, tight line-height, fluid clamp sizing), music cards restyled to thin-bordered divs, data-glitch/data-decor CSS rules added
- **What's left in PR 6**: verify visually, commit, push
- **Next up**: PR 7 (GlitchText component), PR 8 (progress line), PR 9 (/about page)

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
