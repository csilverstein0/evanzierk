# Plan v3 — Visual Redesign + Text Glitch Effects

## Context
Redesign layout to match mockups. Add Symphony-and-Acid-inspired character-level hover glitch effects to typographic elements. Add /about route.

## Design Changes

### Layout (from mockups)
- **Name "Evan Zerk"**: top-left, very large. "Evan" has dark brown/olive background highlight.
- **Music boxes**: single horizontal row (desktop), vertical stack (mobile), centered vertically on page. Thin-bordered outlined rectangles. Keep existing hover behavior (scale, shadow, audio, background image swap).
- **"About"**: large text, bottom-right (desktop), bottom-left (mobile). Links to `/about`.
- **Background**: warm cream/beige default. Track background images fade over cream on hover.
- **Remove**: bio text and Spotify/Instagram/YouTube buttons from hero entirely.
- **Typography**: warm brown text color (#5c4a3a or similar from mockup), not black.

### Text Glitch Effects (Symphony and Acid–inspired)
- **Applies to**: "Evan Zerk" heading and "About" text only. NOT music cards.
- **Mechanism**: split text into individual `<span>` elements per character. On hover over the text region, apply randomized per-character visual attributes.
- **Effects** (adapted to warm palette):
  - Random background color on individual characters (browns, olives, creams, dark accents)
  - Random text color shifts
  - Uppercase/lowercase toggle
  - Letter-spacing changes
  - Underline/italic decoration
  - Occasional font-weight shifts
- **Decay**: effects apply on hover, probabilistically decay (remove) over time so they feel organic, not static.
- **Color palette**: warm tones matching mockup — dark brown, olive, cream, muted gold. Not the cyan/red/yellow of the original.
- **Implementation**: attribute-based CSS styling (`data-glitch`, `data-decor` attributes) following Symphony and Acid's pattern. `requestAnimationFrame` loop for decay.

### Progress Line (Red)
- Red vertical line sweeps left-to-right tracking current audio clip playback progress.
- Implementation: Symphony and Acid's `box-shadow: inset` trick — a full-viewport overlay span whose width = playback percentage, with a red inset box-shadow on the right edge.
- Only visible while audio is playing (a track is hovered). Resets when hover leaves.
- `pointer-events: none` so it doesn't block interaction.

### /about Route
- Add `app/about/page.tsx` — placeholder page for now.
- Static export compatible (Next.js generates `/about/index.html`).
- "About" text on home page links to `/about`.

## Architecture Changes

### New components
- `components/glitch-text.tsx` — `'use client'` component. Accepts `text`, `tag` (h1/span/etc), `className`. Splits text into per-character spans. Manages hover glitch state via `data-glitch`/`data-decor` attributes + rAF decay loop.

### Modified components
- `components/hero-section.tsx` — remove bio + links. Reposition name top-left. Use `<GlitchText>` for "Evan Zerk". Add "Evan" background highlight.
- `app/page.tsx` — add "About" link (bottom-right/left), use `<GlitchText>` for it. Adjust layout to match mockup (name top-left, cards centered, about bottom-corner).
- `app/layout.tsx` — change background to cream.
- `app/globals.css` — update `:root` color variables to warm palette. Add `[data-glitch]` and `[data-decor]` attribute styles.

### New files
- `app/about/page.tsx` — placeholder about page.

### Unchanged
- `components/music-grid.tsx` — no changes to hover/audio/background-image logic.
- `components/music-card.tsx` — keep existing scale/shadow behavior. Restyle to thin-bordered outlined rectangles.

## Color Palette

From mockup:
- Background: `#f5f0e8` (warm cream)
- Text: `#5c4a3a` (dark brown)
- "Evan" highlight: `#6b5d4f` (olive-brown)
- Glitch palette: `#5c4a3a`, `#6b5d4f`, `#8c7a6a`, `#d4c8b8`, `#f5f0e8`, `#3d2e1f`

## Steps

1. Update `globals.css` — change `:root` background/foreground to cream/brown palette. Add `[data-glitch]` and `[data-decor]` CSS rules.
2. Build `components/glitch-text.tsx` — client component: split text to char spans, hover handler applies random attributes, rAF decay loop removes them.
3. Redesign `components/hero-section.tsx` — remove bio + links. Name top-left, large. "Evan" has brown background highlight. Use `<GlitchText>`.
4. Restyle `components/music-card.tsx` — thin-bordered outlined rectangles matching mockup.
5. Update `app/page.tsx` — new layout: name top-left (hero), cards centered vertically, "About" bottom-right/left with `<GlitchText>`. Link to `/about`.
6. Add progress line overlay to `components/music-grid.tsx` — red inset box-shadow span, width driven by audio `timeupdate`.
7. Create `app/about/page.tsx` — placeholder about page.
8. `npm run build` — verify static export.

## Resolved Questions

1. **Font**: Helvetica with Arial fallback. Remove Geist.
2. **"Evan" highlight**: exact color/sizing tuned against real render.
3. **Glitch intensity**: subtle — 1-2 characters at a time, soft color shifts.
4. **Progress line color**: olive/gold accent (not red). Complements warm palette.
5. **Mobile breakpoint**: 640px (sm). Phones get vertical stack, tablets get horizontal row.
