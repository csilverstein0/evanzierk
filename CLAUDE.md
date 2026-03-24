# evanzierk.com

Personal landing page for musician Evan Zerk. Built as a test of agentic coding tools.

## Stack
- Next.js 16.2.1 (App Router, static export)
- React 19.2.4
- Tailwind CSS v4 (CSS-first config, OKLCH colors)
- shadcn/ui v4.1.0 (base-nova style, @base-ui/react primitives)
- Hosted on GitHub Pages

## Commands
- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — static export to `out/`
- `npm run lint` — ESLint

## Key architecture decisions
- **Single page, no routing** — everything in `app/page.tsx`
- **basePath is conditional** — empty in dev, `"/evanzierk"` in production (avoids redirect loop in dev). See `next.config.ts`.
- **Static export** — `output: "export"` in next.config.ts. No server-side features (no cookies, headers, ISR, server actions).
- **`'use client'` pushed deep** — only interactive components (music grid) need it. Page and hero section are server components.
- **Audio files** go in `public/audio/` (track-1.mp3 through track-6.mp3). Background images in `public/images/`.

## GitHub Pages
- Repo: https://github.com/csilverstein0/evanzierk
- Live URL: https://csilverstein0.github.io/evanzierk/
- Deploy: GitHub Actions workflow in `.github/workflows/deploy.yml` (PR 5)

## Plans
Detailed plans and research in `Plans/` directory:
- `pr-sequence.md` — PR breakdown with execution instructions and project state
- `research.md` — technology research report
- `plan-v2.md` — current design plan

## Style guidelines
- When writing plans, be extremely concise. Sacrifice grammar for concision.
- Break plans into atomic chunks.
- End every plan with a numbered list of concrete steps.
- At the end of each plan, list unresolved questions.
