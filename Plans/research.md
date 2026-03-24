# Technology Research Report: evanzierk.com

## Overview

This report covers the four core technologies used to build Evan Zerk's personal landing page: **Next.js App Router**, **shadcn/ui**, **Tailwind CSS v4**, and the **HTMLAudioElement API** for hover-triggered audio playback. Each section provides a technical summary, key concepts, how it fits into our project, and gotchas to watch for.

---

## 1. Next.js App Router

### What It Is

Next.js App Router is the modern file-system-based routing system introduced in Next.js 13 and stable since v14. It is the recommended approach for all new Next.js projects as of 2026. It replaces the legacy Pages Router (`pages/` directory) with the `app/` directory and is built on **React Server Components (RSCs)**.

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Server Components** | Default in `app/`. Run exclusively on the server, send zero JS to the client. Can do async data fetching directly. Cannot use hooks (`useState`, `useEffect`) or browser APIs. |
| **Client Components** | Opt-in via `'use client'` directive at the top of a file. Required for interactivity: state, event handlers, browser APIs, lifecycle hooks. |
| **`layout.tsx`** | Root layout wraps all pages. Persists across navigations without re-mounting. Required in every Next.js App Router project. |
| **`page.tsx`** | Defines the unique UI for a route segment. `app/page.tsx` = homepage (`/`). |
| **Static Rendering** | Default. Pages rendered at build time and cached. Ideal for our single-page site. |
| **Dynamic Rendering** | Triggered by `cookies()`, `headers()`, or uncached fetches. Not needed for our project. |

### How It Applies to Our Project

- We use a **single `app/page.tsx`** — no routing needed.
- `app/layout.tsx` provides the HTML shell (fonts, metadata, global styles).
- The page itself is mostly a **Server Component** (static content: name, bio, links).
- The **music card grid** requires `'use client'` because it uses `useRef`, `onMouseEnter`/`onMouseLeave`, and the `HTMLAudioElement` browser API.
- Best practice: push `'use client'` as deep as possible. The page can be a Server Component that renders Client Component `<MusicCard>` children.

### Gotchas

- All components in `app/` are Server Components by default — adding `useState` without `'use client'` throws an error.
- A Client Component **cannot directly import** a Server Component. Pass server content as `children` props instead.
- The four-layer caching system (request memoization, data cache, full route cache, router cache) is powerful but can cause stale data issues. Not a concern for our static site, but worth knowing.

---

## 2. shadcn/ui

### What It Is

shadcn/ui is **not a component library** in the traditional sense. It's a collection of copy-paste React components built on **Radix UI** primitives (for accessibility) and styled with **Tailwind CSS** via **class-variance-authority (CVA)** for variant management. Components are copied directly into your codebase — you own and modify them freely.

### How It Works

1. **`npx shadcn@latest init`** — bootstraps your project:
   - Creates `components.json` (config: style, Tailwind paths, CSS variables)
   - Sets up `lib/utils.ts` (the `cn()` utility for merging Tailwind classes)
   - Configures path aliases (`@/components/ui`)
   - Injects CSS variable tokens into `globals.css`

2. **`npx shadcn@latest add <component>`** — copies a component's source code into `components/ui/`:
   - Auto-installs Radix dependencies
   - Updates TypeScript path config if needed

### Key Components We'll Use

| Component | Structure | Purpose in Our Project |
|-----------|-----------|----------------------|
| **Card** | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` — composable sub-components | Base for the music boxes in the 2x3 grid |
| **Button** | Variants: `default`, `destructive`, `outline`, `ghost`, `link`. Sizes: `default`, `sm`, `lg` | External links (Spotify, Bandcamp, etc.) |

### Theming System

- CSS variables defined in `:root` and `.dark` selectors in `globals.css`
- Variables like `--primary`, `--background`, `--radius` control the entire look
- shadcn/ui components reference these tokens (e.g., `bg-primary`, `text-muted-foreground`)
- Compatible with Tailwind v4's `@theme` directive and OKLCH colors

### CVA (class-variance-authority)

CVA is the engine behind shadcn/ui's variant system. Example pattern:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
```

This means we can customize any component by editing its CVA variants directly — no theme overrides or `!important` hacks.

### How It Applies to Our Project

- `Card` becomes the base for each music box. We'll customize it with square aspect ratio and hover effects.
- `Button` for the three external links.
- Light minimal theme: we adjust CSS variables for a white background, neutral tones, clean typography.
- Since components are local source code, we can freely add custom hover animations or audio-related props.

### Gotchas

- Must run `init` before `add` — the CLI expects `components.json` to exist.
- Verify that `globals.css` has the correct `@tailwind` directives (or `@import 'tailwindcss'` for v4).
- Always verify `tsconfig.json` has path aliases configured (`@/*` → `./src/*` or `./*`).

---

## 3. Tailwind CSS v4

### What It Is

Tailwind CSS v4 (stable: v4.0.8 as of early 2026) is a major evolution that replaces JavaScript-based configuration with a **CSS-first** approach. The `tailwind.config.js` file is no longer required — all configuration lives in CSS via the `@theme` directive.

### Key Changes from v3

| Feature | v3 | v4 |
|---------|----|----|
| **Configuration** | `tailwind.config.js` (JavaScript) | `@theme` directive in CSS |
| **PostCSS plugin** | `tailwindcss` | `@tailwindcss/postcss` |
| **Import syntax** | `@tailwind base; @tailwind components; @tailwind utilities;` | `@import 'tailwindcss';` |
| **Color system** | HSL-based | OKLCH (perceptually uniform) |
| **Container queries** | Plugin required | Built-in (`@md:`, `@lg:` prefixes) |
| **Theme sharing** | Export/import JS config | Copy CSS `@theme` block |

### The `@theme` Directive

This is the centerpiece of v4. You define design tokens in CSS, and Tailwind auto-generates utility classes from them:

```css
@import 'tailwindcss';

@theme {
  --color-primary-500: oklch(0.6 0.15 240);
  --color-surface: oklch(0.98 0.002 240);
  --font-heading: 'Inter', sans-serif;
  --spacing-gutter: 2rem;
}
```

This generates classes like `bg-primary-500`, `bg-surface`, `font-heading`, and `p-gutter` automatically.

### OKLCH Color System

v4 defaults to OKLCH color space, which is perceptually uniform — meaning lightness values correspond to how humans actually perceive brightness. This makes it easier to create consistent color scales:

```css
--color-primary-50: oklch(0.95 0.02 240);   /* Very light */
--color-primary-500: oklch(0.6 0.15 240);    /* Mid */
--color-primary-900: oklch(0.2 0.08 240);    /* Very dark */
```

### Container Queries (Built-in)

No plugin needed. Use `@md:`, `@lg:` prefixes to make components respond to their container's width rather than the viewport:

```html
<div class="@container">
  <div class="@md:grid-cols-3 grid grid-cols-1">
    <!-- Responds to container, not viewport -->
  </div>
</div>
```

### PostCSS Configuration for v4

```js
// postcss.config.js (v4)
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
};
```

Note: this replaces the v3 pattern of `tailwindcss: {}` and `autoprefixer: {}`.

### How It Applies to Our Project

- `@import 'tailwindcss'` in `globals.css` instead of the three `@tailwind` directives.
- `@theme` block for our light minimal palette (white background, neutral grays, clean fonts).
- OKLCH colors for any accent tones (hover states, link colors).
- Container queries could be useful for the music grid — cards respond to grid cell size rather than viewport.
- `@tailwindcss/postcss` in PostCSS config.

### Gotchas

- **shadcn/ui compatibility**: shadcn's `init` may scaffold for v3 syntax. We may need to adjust `globals.css` to use `@import 'tailwindcss'` and `@theme` instead of `@tailwind` directives if the CLI doesn't handle v4 natively yet.
- `tailwind.config.js` is **not needed** in v4, but shadcn's CLI may still generate one. It can be removed or kept as a fallback.
- The `@tailwindcss/postcss` package replaces both `tailwindcss` and `autoprefixer` in PostCSS config.

---

## 4. HTMLAudioElement API (Hover-to-Play Audio)

### What It Is

The `HTMLAudioElement` API is a browser-native interface for audio playback. It's the right choice for our hover-to-play feature — simpler than the Web Audio API, which is designed for real-time audio processing, DSP effects, and visualization.

### API Comparison

| Feature | HTMLAudioElement | Web Audio API |
|---------|-----------------|---------------|
| **Complexity** | Low — constructor + play/pause | High — AudioContext, nodes, buffers |
| **Use case** | Simple playback | Effects, visualization, spatial audio |
| **Hover audio** | Ideal | Overkill |
| **Browser support** | Universal | Universal (but more setup) |
| **Performance** | Lightweight | Higher overhead |

### Core Pattern for React

```tsx
'use client';
import { useRef } from 'react';

function MusicCard({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMouseEnter = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = 0.7;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Silently handle autoplay rejection
    });
  };

  const handleMouseLeave = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card content */}
    </div>
  );
}
```

### Key Technical Details

**`useRef` for audio instances**: Audio elements are stored in refs (not state) because:
- They don't need to trigger re-renders
- Refs persist across renders without causing update cycles
- The audio object is mutable and side-effect-heavy — state would be inappropriate

**`play()` returns a Promise**: Always `.catch()` it. The browser may reject playback due to autoplay policies.

**`currentTime = 0`**: Reset before playing to ensure the clip starts from the beginning on each hover.

### Browser Autoplay Policies

This is the most critical consideration for our feature:

| Scenario | Chrome | Firefox | Safari |
|----------|--------|---------|--------|
| Hover after any click on page | Allowed | Allowed | Allowed |
| Hover with no prior interaction | May block | May block | Blocks |
| HTTPS context | Required | Recommended | Required |

**Key insight**: Hover events are considered user gestures in most browsers, but **Safari is stricter** — it may require a prior click/tap interaction before any audio can play. Our graceful fallback (silent `.catch()`) handles this transparently.

**Mitigation strategies**:
1. Catch and silently swallow `NotAllowedError` — the user simply won't hear audio until they interact with the page.
2. Optionally: show a small "click to enable audio" prompt on first visit.
3. Set `preload="auto"` to ensure audio data is loaded before the user hovers.

### Handling Missing Audio Files

Since the user will add audio files later, we need graceful behavior when files don't exist:

```tsx
useEffect(() => {
  const audio = new Audio(src);
  audio.addEventListener('error', () => {
    // File missing or format unsupported — fail silently
    audioRef.current = null;
  });
  audio.addEventListener('canplay', () => {
    audioRef.current = audio;
  });
  audio.preload = 'auto';

  return () => {
    audio.pause();
    audio.src = '';
  };
}, [src]);
```

### Performance: 6 Audio Elements on One Page

With only 6 audio elements, performance is not a concern. However, best practices include:

- **Lazy initialization**: Create `new Audio()` on first hover rather than on mount. Avoids 6 HTTP requests on page load for files that may not exist yet.
- **Preload strategy**: Use `preload="metadata"` initially, upgrade to `preload="auto"` on first hover within the grid area.
- **Volume**: Default to 0.5–0.7 range to avoid startling users.
- **Cleanup**: Pause and clear `src` in `useEffect` cleanup to prevent memory leaks.
- **Single playback**: When hovering card B, pause card A's audio first. Only one track should play at a time.

---

## Technology Taxonomy

```
evanzierk.com Tech Stack
├── Framework
│   └── Next.js (App Router)
│       ├── React Server Components (static content)
│       └── Client Components ('use client' for interactivity)
│
├── UI Components
│   └── shadcn/ui
│       ├── Radix UI (accessibility primitives)
│       ├── CVA (variant management)
│       ├── Card → music boxes
│       └── Button → external links
│
├── Styling
│   └── Tailwind CSS v4
│       ├── @theme directive (design tokens)
│       ├── OKLCH color system
│       ├── Container queries (@md:, @lg:)
│       └── @tailwindcss/postcss (build plugin)
│
└── Audio
    └── HTMLAudioElement API
        ├── useRef (instance management)
        ├── play()/pause() (hover control)
        ├── Autoplay policy handling (.catch())
        └── Lazy initialization (perf)
```

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Safari blocks hover audio without prior interaction | Medium | Silent `.catch()`, optional "enable audio" prompt |
| shadcn CLI scaffolds Tailwind v3 syntax | Low | Manually update `globals.css` to v4 syntax if needed |
| Missing audio files cause console errors | Low | Error event listener + null guard on audioRef |
| Multiple tracks playing simultaneously | Low | Pause all other tracks when a new one starts |

---

## Sources

- Next.js App Router documentation and dev.to guides (2026)
- shadcn/ui handbook, CLI docs, and Radix UI integration guides
- Tailwind CSS v4 theme customization docs (Steve Kinney), Preline UI changelog
- MDN HTMLAudioElement reference, CSS-Tricks Web Audio API guide
- Educative.io and LogRocket guides on React audio playback
