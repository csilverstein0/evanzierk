# Symphony in Acid — Font Details

## Primary Font

```css
font-family: Helvetica, Arial, sans-serif;
```

- **Helvetica** on Mac/iOS (pre-installed)
- **Arial** on Windows (metric-compatible substitute, not shipped with Helvetica)
- **sans-serif** fallback on Linux/other

No custom web font for main text. System font stack only.

## Base Size Calculation

```js
fontSize = Math.sqrt(vw * vh) * 1.3;  // geometric mean of viewport dims
// Set as CSS custom property:
--fs: ~18.7px  // on 1920×1080
```

Body text: `calc(var(--fs) * 5.5)` → ~103px on 1080p. Very large display type.

## Per-Scene Size Overrides

| Scene | Size | ~px (1080p) |
|---|---|---|
| 1 (intro) | base (5.5 × --fs) | 103 |
| 3 (motto) | 230% | 237 |
| 6 | 50% | 51 |
| 7 (grid) | 25% | 26 |
| 8 (scroll reveal) | 800% | 824 |
| 9 | 180% | 185 |
| 13 | 33.3% | 34 |
| 14 | 8.3vw | 159 |
| 16–17 | calc(--fs × 1.6) | 30 |
| 18–24 | calc(--fs × 1.27) | 24 |

Portrait overrides: Scene 3 drops to 150%, Scene 8 to 400%, Scene 9 to 140%, Scene 14 to 14vw.

## Line Height

```css
line-height: 1em;  /* body/button */
line-height: 1.05em;  /* #container, #intro, #about */
```

Tight — nearly zero leading. Text blocks read as dense slabs.

## Special Font: Wingdings

Self-hosted web font (woff2/woff/ttf):

```css
@font-face {
    font-family: 'Wingdings';
    src: url('/assets/font/wingdings.woff2') ...;
}
```

Applied via:
- `[glitch="5"]` → `font-family: "Wingdings", serif`
- `[decor="3"]` → `font-family: "Wingdings", serif`

Replaces Latin characters with symbol glyphs (arrows, shapes, etc). ~8% chance on character glitch (`chance(0.08) ? 5 : randoml(4)`).

## Other Text Styles (via decor attributes)

- `[decor="1"]` → `text-transform: uppercase`
- `[decor="2"]` → `text-decoration: underline`
- `[decor="4"]` → `font-style: italic`
- `[decor="5"]` → `letter-spacing: 0.2em`
