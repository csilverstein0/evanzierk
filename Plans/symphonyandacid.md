# Symphony in Acid — Deep Technical Analysis

**Site:** https://symphonyinacid.net/
**Music:** Max Cooper
**Animation/Code:** Ksawery Komputery
**Stack:** HTML, CSS, JavaScript, p5.js, jQuery

---

## 1. High-Level Architecture

The site is a single-page interactive music visualizer. When the user clicks "Play," an MP3 audio track begins and the entire page transforms into a sequenced, music-synchronized typographic animation. The experience is divided into **26 scenes**, each with distinct visual behaviors, text content, layout styles, and glitch effects — all choreographed to the audio via a frame-accurate MIDI-like event system.

### Core Files

| File | Purpose |
|---|---|
| `sketch.js` | p5.js entry point — `preload()`, `setup()`, `draw()` loop |
| `stems.js` | The "score" — frame-indexed event map (`midiRecorder`) + scene boundaries (`midiScenes`) |
| `react.js` | The conductor — `react(C, N)` dispatches events to per-scene visual behaviors; `onEveryFrame()` runs continuous per-scene effects |
| `text.js` | Text content loading, HTML generation, DOM manipulation |
| `media.js` | Video textures — loads 4 looping videos, samples pixel colors from them to drive text coloring |
| `ui.js` | Audio playback, progress bar, cursor auto-hide |
| `palette.js` | Color palette definition |
| `keyboard.js` | Keyboard shortcuts (Q/W/E/R/T trigger effects, F fullscreen, Space pause) |
| `functions.js` | Utility functions (color math, random helpers, easing, visibility checks) |
| `story.css` | The bulk of visual styling — per-scene CSS, layout variants, glitch/decor attribute styles |
| `ui.css` | Nav, progress bar, about overlay, loading state |
| `common.css` | CSS reset |

---

## 2. The Audio–Visual Synchronization System

This is the heart of the site. It does **not** use Web Audio API frequency analysis or beat detection. Instead, it uses a **pre-authored frame-indexed event map** — essentially a MIDI piano roll baked into JavaScript.

### 2.1 Frame Clock

```js
const FPS = 30;
var FRAME = 0;
var FRAMEprev = FRAME;
```

Every other animation frame (p5.js runs at 60fps, but `draw()` only processes on even frames → effective 30fps), the system calls `notesFromTrack()`:

```js
function notesFromTrack() {
    FRAME = Math.round(audioElem.currentTime * FPS);
    // If user seeked >10s, snap to nearest scene start
    if (Math.abs(FRAME - FRAMEprev) > 10 * FPS) {
        FRAMEprev = snapToSceneBeginning(FRAME);
    }
    // Replay all events between previous frame and current frame
    for (let f = FRAMEprev; f < FRAME; f++) {
        if (midiRecorder[f]) {
            for (let a of midiRecorder[f]) {
                react(a[0], a[1]);
            }
        }
    }
    FRAMEprev = FRAME;
}
```

**Key design:** The frame pointer is derived from `audioElem.currentTime`, not from a separate clock. This means the visuals are always synced to audio playback position, even if the browser hiccups. If frames are skipped (e.g., tab was backgrounded), all missed events are replayed in a batch on the next `draw()` call.

### 2.2 The MIDI Recorder (Event Map)

`midiRecorder` is a massive object literal mapping frame numbers to arrays of `[channel, note]` pairs:

```js
const midiRecorder = {
    11:  [ [9,4] ],           // Frame 11: DENSE channel, note 5
    145: [ [7,0] ],           // Frame 145: BASS2 channel, note 1
    146: [ [3,0] ],           // Frame 146: POWERUP channel, note 1
    479: [ [1,1] ],           // Frame 479: SCENE change to scene 2
    // ... hundreds more entries spanning ~9134 frames (~5 minutes)
};
```

The file contains hundreds of entries — one for every musically significant moment in the track.

### 2.3 Channel System

Events use 9 channels, mapped by the `react()` function:

| Channel (C) | Name | Purpose |
|---|---|---|
| 1 | SCENE | Scene transitions (N = scene number) |
| 2 | CHORD | Harmonic changes |
| 3 | POWERUP | Build-up/accent events |
| 4 | KICK | Kick drum hits — typically triggers layout changes, background color changes |
| 5 | CLAP | Snare/clap hits — triggers word-level glitches |
| 6 | BASS1 | Bass line part 1 — triggers border changes, layout shifts |
| 7 | BASS2 | Bass line part 2 — triggers color patterns on elements |
| 8 | FX | Sound effects — triggers character-level glitches, Wingdings substitution |
| 9 | DENSE | Dense/busy sections — triggers heavy glitch accumulation |

### 2.4 Scene Boundaries

```js
const midiScenes = [
    0, 479, 959, 1439, 1679, 1919, 2399, 2879, 3112, 3359,
    3839, 4320, 4799, 5279, 5519, 5759, 6175, 6239, 6719,
    6779, 7199, 7679, 8159, 8639, 8765, 9134
];
```

26 scenes over ~9134 frames at 30fps = ~5 minutes 4 seconds. Scene durations vary from ~2 seconds (scene 17→18 transition) to ~16 seconds.

---

## 3. The Progress Bar (Red Line)

### HTML Structure
```html
<div id="progress"><span></span></div>
```

### CSS
```css
#progress {
    position: fixed;
    left: 0; top: 0;
    width: 100%; height: 100%;
    z-index: 2;
    pointer-events: none;
}
#progress span {
    display: block;
    height: 100%;
    box-shadow: -2vw 0 0 0 red inset;  /* 1vw on portrait */
    width: 0;
}
```

### JavaScript (in `ui.js`)
```js
.on('timeupdate', function () {
    $('#progress span').css('width', this.currentTime / this.duration * 100 + '%')
})
```

**How it works:** The `<span>` inside `#progress` is a block element that fills 100% of the viewport height. Its width is set as a percentage of playback progress. The trick is that it uses an **inset box-shadow** (`-2vw 0 0 0 red inset`) on its right edge — so instead of seeing a filled rectangle, you only see a thin red vertical line at the right edge of the span. As `width` grows from 0% to 100%, this red line sweeps left to right across the entire viewport.

The `pointer-events: none` ensures the overlay doesn't block clicks on the text or UI.

**Visibility:** Hidden before playback starts and when the mouse hasn't moved for 1 second during playback (`body.playing.no-move #progress { display: none }`).

---

## 4. Text Effects System

### 4.1 Text Content & Sources

Text comes from Wittgenstein's *Tractatus Logico-Philosophicus* (1921), loaded from 5 text files:

- `intro.txt` — Opening section
- `sentences.txt` — Key philosophical sentences (used for focused display)
- `full.txt` — The full text (~140+ lines)
- `motto.txt` — A motto/epigraph
- `end.txt` — Closing text

Files are loaded via p5.js `loadStrings()` in `preload()`, then parsed into a 4D array: `texts[group][line][word][character]`.

### 4.2 DOM Structure for Text

Text is rendered as nested HTML elements for granular control:

```
<p>                          ← paragraph
  <span word="1">           ← word (word="1" for 4+ chars, "0" for shorter)
    <font char int="72">    ← individual character (when SPLITCHAR=true)
      H
    </font>
    <font char int="101">
      e
    </font>
    ...
  </span>
  ...
</p>
```

When `SPLITCHAR=false`, characters are not individually wrapped:
```
<span word="0"><font>The</font></span>
```

This dual mode allows some scenes to manipulate individual characters while others operate at the word level, controlling performance.

### 4.3 Glitch Effects (Attribute-Based)

Glitches are applied via HTML attributes, not CSS classes, styled in `story.css`:

**Word/Span-level glitches** (`[glitch]` on `<span>`):
| Glitch Value | Effect |
|---|---|
| 0 | No effect (default) |
| 1 | Gray background (`#ccc`), black text |
| 2 | Black background, white text |
| 3 | Black text (force) |
| 4 | Blue background, white text |
| 5 | Wingdings font |

**Character/Font-level decorations** (`[decor]` on `<font>`):
| Decor Value | Effect |
|---|---|
| 0 | No effect |
| 1 | `text-transform: uppercase` |
| 2 | `text-decoration: underline` |
| 3 | Wingdings font |
| 4 | `font-style: italic` |
| 5 | `letter-spacing: 0.2em` |
| 6 | White text |
| 7 | White background |
| 8 | Large padding (all sides) |
| 9 | Large horizontal padding |
| 10 | Large vertical padding |

**Per-scene overrides:** Many scenes override glitch colors. For example, scenes 21-24 make `[glitch="1"]` yellow with blue text instead of the default gray.

### 4.4 Glitch Application Functions

```js
// Glitch all characters sharing the same letter (e.g., all "e"s)
function glitchesChars() {
    let int = randomElem(characters).getAttribute('int');
    let group = container.querySelectorAll(`font[int="${int}"]`);
    let g = chance(0.08) ? 5 : randoml(4);  // 8% chance of Wingdings
    for (let e of group) e.setAttribute('glitch', g);
}

// Glitch a percentage of words
function glitchesWords(perc) {
    let c = randomColor();
    let g = 1 + randoml(3);
    for (let w of words) if (chance(perc * 2)) w.setAttribute('glitch', g);
}

// Glitch entire paragraphs
function glitchesParagraphs(perc) {
    for (p of paragraphs) {
        if (chance(perc * 2)) {
            let elems = p.querySelectorAll("[word]");
            let g = 1 + randoml(3);
            for (let e of elems) e.setAttribute('glitch', g);
        }
    }
}
```

**`glitchesChars()` is particularly clever:** it picks a random character on screen, reads its `int` attribute (ASCII code), then queries ALL elements with that same `int` value. This means when an "e" glitches, ALL "e"s on screen glitch simultaneously — creating a striking pattern where the same letter flickers across the entire text.

### 4.5 Glitch Removal (Decay)

`removeGlitches(perc)` runs on every frame for most scenes, probabilistically resetting `[glitch]` attributes to 0. This creates a natural decay — glitches appear suddenly (on musical events) and fade out gradually. Different scenes use different decay rates:

- Scene 4: 0.3 (fast decay — glitches flash briefly)
- Scene 11: 0.008 (very slow decay — glitches persist)
- Scenes 21-23: 0.1 additional removal on top of base rate

---

## 5. Layout System

Layouts are controlled via the `layout` attribute on `#container`, with 30+ layout variants defined in CSS:

| Layout | Style |
|---|---|
| 0 | Default flow |
| 1 | Uppercase, flexbox justified |
| 2 | Flexbox space-between |
| 3 | Flexbox with word margins |
| 4 | Flexbox space-evenly, gray char backgrounds |
| 5 | White char backgrounds |
| 6 | Black word backgrounds, white text, wide margins |
| 7 | Left-aligned |
| 8 | Right-aligned with left padding |
| 9-10 | Flex-end alignment |
| 11-13 | Inline-block with various vertical alignments |
| 14-15 | Justify/space-evenly |
| 16-20 | CSS Grid with various column counts (4, 6, 8, 12, 16) |
| 21-25 | Table-cell alignments (used in scene 1 intro) |
| 26-27 | Grid with 2-column sub-grids |
| 28-30 | Fixed-width constraints |

Layouts are switched rapidly on KICK events via `randomLayout(min, max)`, creating sudden typographic recompositions.

### Border System

A separate `borders` attribute (0-4) adds borders to `<font>` elements:
- 0: No borders
- 1: Thin (0.02em) black border
- 2: Medium (0.05em) black border
- 3: Thick (0.1em) black border
- 4: Right-side blue border only

---

## 6. Video-Driven Text Coloring (Scenes 13, 18, 20-24)

Four looping video files (`0.webm`/`.mp4` through `3.webm`/`.mp4`) are loaded but hidden. They serve as **color lookup textures** — the system samples pixel colors from the video at positions corresponding to each text element's screen position.

### How It Works

1. Videos are loaded into hidden `<video>` elements, paused by default
2. `loadMediaPixels()` advances the current video by one frame, draws it onto a hidden 128×128 `<canvas>`, and reads the pixel data via `getImageData()`
3. `colorRGBFromMedia(elem)` takes a DOM element, gets its bounding box center, maps that to video-texture coordinates, reads the pixel color, and applies a per-video color mapping:

**Video 0:** RGB thresholding → maps to 3 palette colors (red channel high = palette[0], blue high = palette[1], yellow = palette[2])
**Video 1:** Grayscale brightness with specific brightness bands mapped to accent colors
**Video 2:** Binary black/white threshold
**Video 3:** Grayscale with contrast/lightness adjustment, 73% chance of replacing mid-tones with an accent color

This creates the effect of text being "painted" by an invisible video — abstract video patterns become color patterns across the typography.

---

## 7. Per-Scene Breakdown (Selected Highlights)

### Scene 1 (Frames 0–478) — Intro
- Wittgenstein quote displayed statically
- POWERUP events progressively change layout (bottom-aligned → right-aligned → top-right → centered)
- At POWERUP N=6, the attribution ("Ludwig Wittgenstein") is removed and replaced with word glitches
- At POWERUP N=7,8, hidden "DO" and "NOT" words are revealed: "The limits of my language DO NOT mean the limits of my world"

### Scene 3 (Frames 959–1438) — Word-by-Word Motto
- Displays motto text one word at a time on each KICK
- Each word triggers a new random background color
- CLAP triggers layout randomization
- Accumulates words center-screen at 230% font size

### Scene 7 (Frames 2399–2878) — Grid
- Text displayed in a CSS Grid (7 columns on landscape, 5 on portrait)
- Words have thin black borders creating a table-like appearance
- BASS2 colors entire rows/columns of the grid with accent colors
- KICK randomly adjusts font-size (0.5×–3.5× base) and element min-width/height
- POWERUP cycles through solid background colors: gray → yellow → blue → red → cyan → white

### Scene 8 (Frames 2879–3111) — Scroll Reveal
- Single sentence at 800% font size
- Auto-scrolls vertically
- Characters progressively get `.selected` class (blue highlight) based on scene timer — a "typing/reveal" effect that sweeps across the text synchronized to the tact

### Scene 13 (Frames 4320–4798) — Video Color Mapping
- Text colored by Video 0's pixel data in real time
- Each frame, 62% of characters have their background sampled from the video
- Creates flowing abstract color patterns across dense small text

### Scenes 21-24 (Frames 7199–8764) — Video-Driven Climax
- Black background, dense text
- Videos 3, then 1 drive text colors (foreground in 21, background in 22-23)
- Heavy glitch accumulation with fast-cycling accent colors
- Decor attributes layered on top creating maximum visual density
- This is the visual climax of the piece

### Scene 25 (Frame 8639+) — Credits/End
- Black background, white text
- End text displayed center-screen
- Minimal effects — a quiet resolution

### Scene 26 — Post-Playback
- Clears everything, shows "Replay" button
- Removes "started" and "playing" classes from body

---

## 8. Interactive Features

### Mouse Interaction
- Hovering over any `<font>` element or `<span word>` triggers a random glitch on that element
- Cursor auto-hides after 1 second of inactivity during playback (via `body.no-move` class)
- When cursor is hidden, nav and progress bar also hide

### Keyboard Interaction
| Key | Action |
|---|---|
| Space | Toggle play/pause |
| F | Toggle fullscreen (via p5.js) |
| Q | Random layout change (range 0–30) |
| W | Trigger CLAP effect |
| E | Trigger BASS1 effect |
| R | Trigger BASS1 + BASS2 effects |
| T | Trigger FX + DENSE effects |
| S | Screenshot (p5.js) |
| ↑ | Jump to start |
| ↓ | Restart current scene |
| ← | Previous scene |
| → | Next scene |

---

## 9. Scrolling System

Several scenes use auto-scrolling:
```js
var SCROLL_SPD = 0;

function scrollPage() {
    if (SCROLL_SPD) window.scroll(0, window.scrollY + SCROLL_SPD * vh);
}
```

Called every processed frame in `draw()`. Speed is set per-scene (e.g., Scene 8 calculates speed based on paragraph height to ensure the text scrolls through during the scene duration). Some scenes use `randomScrollSpd()` which can randomly flip scroll direction.

---

## 10. Responsive Design

- Base font size: `Math.sqrt(vw * vh) * 1.3` — scales with geometric mean of viewport dimensions
- Set as CSS custom property `--fs`, with most sizing derived from it: `calc(var(--fs) * 5.5)` for body text
- Scene 7 grid: 7 columns landscape, 5 portrait
- Scene 8: 800% font on landscape, 400% on portrait
- Progress bar: 2vw thick on landscape, 1vw on portrait
- Multiple `@media (max-aspect-ratio: 1/1)` breakpoints for portrait adjustments

---

## 11. Color Palette

```js
`#999999 #00ffff #ff3300 #ffff00 #444444 #777777 #222222 #aaaaaa #cccccc #ff0000 #0000ff`
```

11 colors: grays (5 shades), cyan, red-orange, yellow, pure red, pure blue. `randomColor()` picks from this palette, avoiding the current color. `shortPalette` is a random 3-color subset used for video color mapping.

---

## 12. Key Technical Patterns

1. **Attribute-driven styling over class toggling** — Using `[glitch="2"]`, `[decor="3"]`, `[layout="7"]`, `[borders="2"]` etc. in CSS selectors. This allows numeric values that can be incremented/randomized, and multiple independent visual axes that compose without conflicts.

2. **Probabilistic per-frame effects** — `chance(0.3)` on every element every frame creates organic, non-deterministic visual texture. Effects accumulate and decay stochastically.

3. **Pre-authored timeline, not beat detection** — All musical events are manually mapped to frames. This gives perfect sync but requires manual authoring. The `midiRecorder` object is essentially a hand-crafted MIDI file in JSON.

4. **Video as texture lookup** — Videos aren't displayed; they're sampled via canvas `getImageData()`. The 128×128 resolution is intentionally low for performance.

5. **p5.js as scheduler only** — No canvas drawing occurs. p5.js is used purely for its `preload()`/`setup()`/`draw()` lifecycle, `loadStrings()`, `frameRate()`, `random()`, and `constrain()`/`map()` utilities. All visuals are DOM-based.

6. **Dual-rate processing** — p5.js runs at 60fps but events process at 30fps (`frameCount % 2 == 0`). This decouples smooth browser rendering from the authored 30fps timeline.

---

## 13. Relevance to evanzierk.com

Key techniques that could be adapted:

- **The MIDI recorder pattern**: Pre-author musical events as a frame-indexed object. No FFT or beat detection needed — perfect sync, full creative control.
- **Attribute-based CSS effects**: Use data attributes + CSS selectors for visual states. Composes better than class toggling for multiple effect dimensions.
- **The progress bar trick**: Inset box-shadow on a width-animated span creates a clean sweeping line with minimal DOM.
- **Probabilistic decay**: Apply effects on beat, remove them stochastically each frame. Creates organic visual rhythm.
- **Video-as-texture**: Hidden videos sampled via canvas for generative color patterns (advanced, but striking).
- **Character grouping by ASCII code**: Glitching all instances of the same letter simultaneously is a simple but powerful visual pattern.
