# Lakspire — Design & Build Playbook

Single reference for building pages and sections. Every rule here keeps
the site cohesive across both themes, respects the Ember palette, and
stays Strapi-ready.

---

## 0. Design Requests & Non-Negotiables

The design decisions in this playbook come from real user feedback.
Keep these in mind — they answer "why is it like this?" before you're
tempted to change something.

- **Warm-first, never cool.** Ember/amber/gold on warm ink (dark) or
  cream (light). Never introduce blue, teal, cyan, purple, or neutral
  gray.
- **Font is Outfit.** Never Plus Jakarta Sans, never Inter for display.
- **Animations feel integrated, not boxed.** If an animation reads as
  "a rectangular illustration next to text", it fails. Options:
  - Full-bleed ambient field (`HeroAnnotationField`, `FinalCTAField`)
  - `ClayFrame` — a normal-rectangle content card with two organic
    blob back-plates peeking out behind it (image-#6 reference). See
    §10.
- **Hero has a focal product visual.** The hero's right column is
  `HeroWorkspaceScene` — a live 4-layer CNN annotation workspace, not
  a decorative background. Copy left, focal visual right. Superannotate
  is the reference: the animation IS the product-in-action.
- **Hero above the fold is complete on paint.** CTAs animate in with
  `initial → animate` (never `whileInView`). If your user hasn't
  scrolled, everything they need is already there.
- **Section headings never look sliced under the (invisible) nav.**
  `scroll-margin-top: 96px` is set globally on `h2/h3` and any element
  with `data-scroll-anchor`. Pinned sections (WhatWeDoStory) also
  reserve `pt-24` on the sticky viewport.
- **Ember shadows are big in BOTH themes.** Small drop-shadows read as
  dull. Layered ember shadows (tight ember drop + broad ember glow +
  hairline ember ring) apply to `.illust-frame` and `.themed-card-gradient`
  in dark AND light.
- **CNN/annotation grammar is the site's motion signature.** Corner
  brackets, streaming packets, sparse dot lattices, drifting orbs, node
  networks. Use it in the hero, echo it in the closing CTA.
- **The footer is black in both themes.** It reads as a closing "night
  panel" no matter the page mode. Text/border shims are reversed
  inside `.themed-footer` so off-whites stay light on the black backing.

---

## 1. Foundation

- **Framework:** Next.js 15 App Router + TypeScript, Tailwind v4,
  Motion (Framer Motion v11)
- **Fonts:** Outfit (display), Instrument Serif (editorial italic
  accents), JetBrains Mono (eyebrows/mono captions)
- **CMS-ready rule:** section components accept typed props. Content
  lives in `src/data/*`. Never hardcode copy in a component.
- **File layout:**
  - `src/components/sections/` — full-width page sections
  - `src/components/blocks/` — reusable content blocks
    (`SectionLabel`, `Headline`, `ClayFrame`)
  - `src/components/illustrations/` — SVG scene compositions
  - `src/components/motion/` — motion wrappers (`FadeIn`,
    `StaggerGroup`, `ScrollReveal`, `CursorSpotlight`) + hero focal
    (`HeroWorkspaceScene`) + full-bleed fields (`HeroAnnotationField`,
    `FinalCTAField`, `WorkflowBackground`) + `primitives/`
    (animated SVG atoms)
  - `src/components/layout/` — Navigation, Footer, Shell, ScrollJump
  - `src/data/` — typed static content
  - `src/types/content.ts` — content shape contracts

---

## 2. Themes

Dark (default) / light, switched via `data-theme` on `<html>`. A
pre-hydration inline script reads `localStorage.theme` before paint.
Sun/Moon toggle in the nav right-pill mutates the attribute.

- **Dark:** warm ember night — `#0A0908` base, subtle orange radial
  ambient, near-white cream text (`#FAF5EE`).
- **Light:** warm cream day — `#FBF6EF` base, subtle amber/ember radial
  washes, warm-dark ink text.
- **Ember accents stay identical on both themes** — that's what
  carries the brand.

### Never

- Pure white/black for surfaces or text.
- Cool blues, cyans, or neutral grays.
- Default (cool) drop-shadows. Warm ember alphas only.
- Ember-on-cream for large surfaces (contrast collapses). Wrap in
  `.illust-frame` or `ClayFrame` for a warm-dark viewport.
- Running `npm run build` while `npm run dev` is running against the
  same directory. `next build` overwrites `.next/static/chunks/` with
  hashed production files; the live dev server keeps serving requests
  for unhashed dev names → cascading 404s and a blank page. Verify
  with `npx tsc --noEmit` instead. Recovery if it happens: kill dev
  server → `rm -rf .next` → restart `npm run dev`.

---

## 3. Color Tokens

Use these tokens — they swap automatically on theme change.

### Semantic tokens (theme-aware, in `globals.css`)

| Token | Purpose |
|---|---|
| `--bg-page` | Body base solid |
| `--bg-page-gradient` | Body gradient + ambient blooms |
| `--bg-panel` / `--bg-panel-strong` | Glass surfaces (nav pills) |
| `--card-surface` / `--card-surface-2` | Card backgrounds |
| `--border-glass` / `--border-glass-strong` | Borders |
| `--text-strong` / `--text-body` / `--text-muted` / `--text-faint` | Text hierarchy |
| `--rail-track` | Progress rail base |
| `--highlight-top` | Inset top highlight |
| `--shadow-elev` | Elevated shadow (nav scrolled) |

### Brand accent (fixed across themes)

| Value | Role |
|---|---|
| `#FF6B35` | Ember 500 — primary orange |
| `#FF8F5C` | Ember 400 — light ember |
| `#E05220` | Ember 600 — deep ember |
| `#F4A261` | Amber 500 |
| `#FABD6C` | Amber 400 |
| `#E9C46A` | Gold 500 — highlights, eyebrows |

---

## 4. Utility Classes

Prefer these in new code:

| Class | Purpose |
|---|---|
| `.surface-card` / `.surface-card-strong` | Themed card + border + `rounded-2xl` |
| `.text-heading` / `.text-body-1` / `.text-muted-1` / `.text-faint-1` | Themed text hierarchy |
| `.divider-warm` | Theme-aware horizontal gradient divider |
| `.themed-scrim-bottom` | Bottom-fade scrim per theme |
| `.themed-stat-gradient` | Large stat number text gradient |
| `.themed-card-gradient` | Active/focus card gradient (heavy ember glow in light) |
| `.themed-rail-tip` | Scroll-rail leading edge glow |
| `.illust-frame` | **Every rectangular illustration wraps in this** — warm-dark viewport in both themes, reverses SVG shim inside |
| `.carousel-nav` | Theme-aware chevron button |
| `.text-gradient-primary` / `.text-gradient-ember` | Warm text gradients |
| `.gradient-divider` | Full ember gradient divider |
| `.hero-cursor-halo` | Cursor-tracking warm halo (used by `HeroAnnotationField`, `FinalCTAField`) |
| `.heading-emerge` | Blur-in transition when heading enters viewport (use on section headings if needed) |
| `.scroll-jump` | Fixed glass pill for the `ScrollJump` indicator |

---

## 5. Theme-Aware Authoring Rules

### Do

- Use CSS variables in inline styles for any neutral color.
- Use existing Tailwind opacity classes (`text-white/60`, etc.) — the
  shim in `globals.css` maps common patterns to theme-aware equivalents.
- Use `currentColor` in SVGs where color should match the parent text.
- Use ember/amber/gold hexes directly — no theming needed.
- Wrap sections in `<section className="py-section border-t border-white/[0.05]" data-scroll-anchor="…">`.
  The `data-scroll-anchor` attribute enables the `ScrollJump` indicator
  to jump between sections.

### Don't

- Hardcode arbitrary `rgba(255,255,255,X)` or `rgba(0,0,0,X)`.
- Use `text-black/X` or `bg-white` without theme awareness.
- Introduce a new hex for a neutral — add a token instead.
- Ship a component without loading both themes in the browser.

---

## 6. Typography

Outfit (display), 350–400 weight, tight tracking.

```tsx
<h2 style={{
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(2rem, 1.5rem + 2.5vw, 3.25rem)',
  fontWeight: 350,
  lineHeight: 1.1,
  letterSpacing: '-0.03em',
}} className="text-white/90">
  Strong statement.
  <br />
  <span className="text-white/40">Softer consequence.</span>
</h2>
```

### Scale

| Role | Font size | Weight | Tracking | Line-height |
|---|---|---|---|---|
| Hero h1 | `clamp(2.4rem, 1.8rem + 3vw, 4.5rem)` | 350 | -0.03em | 1.06 |
| Section h2 | `clamp(2rem, 1.5rem + 2.5vw, 3.25rem)` | 350 | -0.03em | 1.1 |
| Card h3 | `clamp(1.5rem, 1.15rem + 1.5vw, 2.25rem)` | 400 | -0.02em | 1.15 |
| Body p | `15px` | 400 | 0 | 1.6 |
| Eyebrow / mono | `10–11px` uppercase | 500 | 0.14em+ | 1 |

### Second-clause pattern

`Strong statement.` + `<span className="text-white/40">softer consequence.</span>`

### Editorial italic

`<span className="editorial">…</span>` — Instrument Serif italic. Use
sparingly for hero-only poetic moments.

---

## 7. Motion

Purposeful, not decorative. GPU-only (`transform`, `opacity`, `filter`).
Honor `prefers-reduced-motion` (already handled globally).

### Wrappers

- `<FadeIn>` — fade + rise on scroll (`whileInView`). **Never in the
  hero above the fold.**
- `<ScrollReveal>` — attaches to `[data-reveal]` elements.
- `<StaggerGroup>` + `<StaggerItem>` — sequenced child reveals.
- `<CursorSpotlight>` — global cursor-tracking warm glow.

### Above-the-fold rule

For the hero, use `initial → animate` inline motion (see
`HeroSection.tsx`). `whileInView` gates paint on scroll intersection,
which delays CTAs. The user's first paint should be complete.

### Motion primitives (SVG atoms, in `motion/primitives/`)

- `PulseDot`, `FlowingLine`, `DataStream`, `Waveform`, `NetworkNode`,
  `DrawPath`, `CountUp`, `ProgressBar`.

**Compose these; don't rewrite SVG animation logic.**

### Hero focal + fields (in `motion/`)

- `HeroWorkspaceScene` — the hero's focal visual. A live 4-layer CNN
  annotation workspace (INGEST → ENCODE → REASON → INSIGHT, 21 nodes
  total: 4/7/7/3), 10 highlighted streaming packet paths, 3 cycling
  bounding-box annotations (draw-in → hold with label chip → fade),
  a top-right progress ring, top-left metadata chip, bottom metrics
  strip, ember corner brackets, 18 ambient drift orbs. Wrapped in
  `.illust-frame` (soft-override styles) so the workspace has its own
  warm-dark canvas + amped ember shadow in BOTH themes. This is
  what makes the hero read as product-in-action. Cursor-magnetic:
  nodes swell near cursor, edges brighten, bbox detail chips expand.
- `HeroAnnotationField` — the AMBIENT layer only. Sparse dot lattice,
  3 quiet scan-line packets, warm cursor halo, rotating reticle at
  cursor position. Sits full-bleed behind everything and never
  competes with the focal scene.
- `FinalCTAField` — flowing arcs + streaming packets + corner brackets.
  Sits INSIDE the CTA card behind the copy.
- `WorkflowBackground` — animated grid + pipeline curves (background
  texture for content sections).

Density budget for the AMBIENT field: **≤ 4 signals**. More reads as
clutter. The focal scene (`HeroWorkspaceScene`) can be dense — that's
the point of a focal.

### Scroll-driven patterns

- Pinned scrollytelling (`WhatWeDoStory`): `N × 70vh` container +
  `sticky top-0 h-screen` viewport with `pt-24` to reserve nav zone.
  Per-slice `localP = p - i` drives translate/opacity/rail-fill.
- Horizontal auto-rotator (`WhyLakspire`): center-focused,
  blurred/scaled neighbours, wrap-around every N seconds. Hover pauses.
- `FadeIn` / `StaggerGroup` for standard entrances.

### Durations & easing

- Enter: `500–700ms` with `cubic-bezier(0.16, 1, 0.3, 1)`.
- Swap/switch: `200–300ms`.
- Continuous drift: linked to scroll — no timing curve.
- Hover: `200ms` linear or ease-out.

---

## 8. Section Structure

Every full-width page section:

```tsx
<section
  className="py-section border-t border-white/[0.05]"
  data-scroll-anchor="unique-slug"
>
  <div className="mx-auto max-w-container container-pad">
    <FadeIn>
      <SectionLabel className="mb-4">Section Kind</SectionLabel>
      <h2 className="max-w-2xl text-white/90" style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 1.5rem + 2.5vw, 3.25rem)',
        fontWeight: 350,
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
      }}>
        Strong statement.
        <br />
        <span className="text-white/40">Softer consequence.</span>
      </h2>
    </FadeIn>
    {/* Body content */}
  </div>
</section>
```

Rules:
- `py-section` for vertical rhythm.
- `border-t border-white/[0.05]` for subtle divider.
- `data-scroll-anchor="…"` — required. Enables the `ScrollJump`
  indicator to jump between sections.
- `SectionLabel` eyebrow + h2 second-clause pattern.

---

## 9. Cards & Surfaces

Preferred:

```tsx
<div className="surface-card p-7">…</div>
```

Custom control:

```tsx
<div className="rounded-2xl border p-7" style={{
  background: 'var(--card-surface)',
  borderColor: 'var(--border-glass)',
  boxShadow: '0 20px 60px -20px rgba(255,107,53,0.14), inset 0 1px 0 0 var(--highlight-top)',
}}>…</div>
```

- Corner radius: `rounded-2xl` (1rem) standard, `rounded-3xl` for hero-level.
- Padding: `p-7` (28px) standard, `p-8` (32px) for hero cards.
- Elevated cards: warm ember drop shadow. Never neutral gray.

---

## 10. Illustrations & Icons

### Rectangular illustration → `.illust-frame`

Every full illustration wraps in this class. It gives a warm-dark
viewport in BOTH themes and reverses the SVG shim inside so light-mode
diagrams stay readable. In light theme, the frame has an amped ember
drop shadow (tight ember + broad ember glow + subtle border ring).

### Sculpted illustration → `<ClayFrame>`

For non-hero illustrations that should feel sculpted into the layout.
Content lives in a **normal rounded rectangle** (never clipped by a
weird curve) — behind it, TWO distinct organic blob back-plates peek
out at rotated angles (image-#6 reference: soft shapes stacked to
imply a bigger form around the content). All three plates carry heavy
layered ember `box-shadow`; ember bleeds out on every side.

```tsx
<ClayFrame variant="pebble">   {/* pebble | wave | petal | drop */}
  <YourIllustration />
</ClayFrame>
```

Design principles:
- **Never clip the content.** The front plate is a normal rectangle
  with `border-radius: 24px`. The organic blob silhouette is decoration
  behind, not a mask on the animation.
- **Distinct silhouettes per plate.** Rotating one shape and stacking
  three copies reads as "cut into pieces." Give each plate its own
  border-radius signature and rotation so it looks like real different
  shapes stacked.
- **Ember `box-shadow`, never `filter: drop-shadow(clip-path)`.**
  `clip-path` clips the shadow filter too, killing the ember bleed.
  Box-shadow follows the rounded border and extends beyond the element.
- **Vary variant per section** — pebble, wave, petal, drop each carry
  a distinct silhouette. Repeating the same variant across every
  section reads as a repeating rectangle.

Currently rolled to `AICapabilityRadial` (petal) in `AIDataSolutions`
and all six service illustrations in `WhatWeDoStory`. If a wrapped
illustration also carries its own `illust-frame` internally, strip the
inner class — ClayFrame's front plate provides the frame.

### Icons

- Custom SVG glyphs preferred for anything a reader notices.
- Lucide is acceptable for utility icons (chevrons, close, controls).
- Always render SVG with `stroke="currentColor"`.
- Never `fill="black"` / `fill="white"` — use `currentColor` or theme tokens.

---

## 11. Navigation & Chrome

- Three floating pills (logo · nav · theme+CTA). Nothing else lives at
  `top-4 z-50` except the nav.
- `ScrollJump` (`bottom-right`, `z-40`) — glass pill with a chevron.
  Shows once scrolled >10% of the first viewport. Jumps to the next
  `[data-scroll-anchor]`. Near the bottom, flips to "up" and jumps to
  the top instead. Aesthetic mirrors the nav pills (glass + warm
  aura + hover to ember gradient).

---

## 12. Hero Anatomy

- **Two-column** layout: copy left, `HeroWorkspaceScene` right.
  Grid ratio: `lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]` — the
  workspace gets slightly more width so it doesn't feel cramped.
- **Right column focal (`HeroWorkspaceScene`).** A live 4-layer CNN
  annotation workspace (viewBox `1000×560`, widescreen aspect):
  - 21 nodes across 4 layers (INGEST 4 → ENCODE 7 → REASON 7 → INSIGHT 3)
  - 10 highlighted streaming-packet paths across all layer transitions
  - 3 cycling annotation bounding boxes with confidence-labeled chips
  - Progress ring (top-right), metadata chip (top-left), metrics strip
    (bottom), ember corner brackets, 18 drift orbs
  - Wrapped in `.illust-frame` (with softened border-radius/border
    inline) so it has a warm-dark canvas + amped ember shadow in BOTH
    themes. This is the fix for "workspace looks bad on cream."
- **Ambient behind everything (`HeroAnnotationField`).** Sparse
  lattice, 3 scan-line packets, warm cursor halo, rotating reticle.
  Density budget **≤ 4 signals**.
- **Cursor rings brighter in light mode.** `.hero-reticle` class hook
  in the ambient field's reticle group; light-mode CSS forces stroke
  opacity to `0.95 !important` + adds `drop-shadow(0 0 4px rgba(224,82,32,0.7))`.
  Halo opacity bumped from 22% → 45% at center in light mode.
- **CTAs animate in with `initial → animate` at ~0.28s** — no scroll
  gating. Copy column keeps room for stats row without pushing CTAs
  below the fold.
- Hero uses `min-h-[92svh]` + `pt-24` — smaller than a full viewport
  so scroll flows immediately.

---

## 13. Closing CTA Anatomy

- Big rounded-3xl card with ember-warm gradient background.
- `FinalCTAField` weaves through the card behind the copy (arcs +
  streaming packets + corner brackets + cursor halo). Not a separate
  boxed animation — same annotation grammar as the hero, closing the
  visual loop.
- Two-line headline: **strong statement** + softer consequence, with
  `editorial` italic for the emphasized phrase.
- Anchor: `data-scroll-anchor="cta"`.

---

## 14. Adding a New Section — Checklist

- [ ] `<section className="py-section border-t border-white/[0.05]" data-scroll-anchor="slug">`
- [ ] `SectionLabel` + h2 with second-clause pattern
- [ ] Content pulled from `src/data/`
- [ ] Props typed against `src/types/content.ts` if reused
- [ ] No hardcoded `rgba(255,255,255,X)` or `rgba(0,0,0,X)`
- [ ] No new pure-white/pure-black hex values
- [ ] Illustration wrapped in `.illust-frame` OR `<ClayFrame>`
- [ ] Verified in **both** themes
- [ ] Motion is purposeful; honors `prefers-reduced-motion`
- [ ] SVG icons use `currentColor`; SVG illustrations use only
  ember/amber/gold hexes or the two off-white rgbas the shim covers

---

## 15. Adding a New Page

1. `src/app/<route>/page.tsx`.
2. Import sections from `src/components/sections/`.
3. Only home is full scrollytelling — sub-pages are typically simpler.
4. Layout wraps every page with `Navigation` + `Footer` + `SmoothScroll`
   + `CursorSpotlight` + `ScrollJump`. Don't wrap sub-pages again.
5. Set page-specific `metadata`.
6. Verify in both themes.

---

## 16. Data & Types

- Static content in `src/data/*.ts`.
- Content shapes in `src/types/content.ts`.
- Prep data files to be trivially replaceable with `fetch('/api/…')`.

---

## 17. Quick Reference — What to Reach For

| Need | Reach for |
|---|---|
| Animated scroll section | `WhatWeDoStory.tsx` structure |
| Horizontal auto-carousel | `WhyLakspire.tsx` structure |
| Content grid with icons | `Industries.tsx` / `TechHumanExpertise.tsx` |
| Storytelling side-by-side | `AIDataSolutions.tsx` |
| Long editorial with step numbers | `HowWeWork.tsx` |
| Final page CTA | `FinalCTA.tsx` |
| Simple entrance | `<FadeIn>` |
| Above-the-fold entrance | inline `initial → animate` motion |
| Staggered children | `<StaggerGroup>` + `<StaggerItem>` |
| Rectangular illustration wrapper | `.illust-frame` |
| Sculpted-silhouette illustration wrapper | `<ClayFrame variant=…>` |
| Hero focal (live workspace scene) | `<HeroWorkspaceScene>` |
| Hero ambient atmosphere | `<HeroAnnotationField>` |
| Full-bleed CTA atmosphere | `<FinalCTAField>` |
| Section jumper | `ScrollJump` (auto) — add `data-scroll-anchor` to sections |
| Verify changes without breaking dev | `npx tsc --noEmit` (never `npm run build`) |

---

**Golden rule:** if you're about to reach for `#FFFFFF`, `#000000`, a
cool gray, a `clip-path` around an animation, a `whileInView` in the
hero, or `npm run build` while the dev server is running — stop.
Reach for a warm token, a `box-shadow`, an inline `initial → animate`,
or `tsc --noEmit`. The site's soul is warm, sculpted, and complete on
paint.
