# UI / UX specification

Authoritative for colour, type, spacing, motion and component behaviour on this site.
Derived from the Nexus brand system (published guidelines:
https://claude.ai/code/artifact/a6f74417-7398-4dea-bca9-8e67d220fce3). **Use this file,
not that page** — the tokens here are the implementation.

---

## 1. Design intent

The site does two jobs that pull against each other: it is a **credibility document** for
regulated-sector buyers deciding whether to trust Nexus with their control environment,
and a **billboard for web-design capability**.

**The resolution: the site reads as precise, not exuberant.** Creative range is
demonstrated through the craft of the execution — the restraint, the timing, the
typography — not through decoration. Every effect must survive the question *"does this
make a compliance officer trust us more or less?"*

## 2. Colour

Tokens are CSS custom properties on `:root`. Never hardcode a hex value in a component.

```css
:root {
  /* Brand */
  --ink:        #0B1E2D;  /* anchor — headlines, body, dark grounds */
  --cyan:       #00A9D6;  /* brand colour — graphic use only on light */
  --cyan-deep:  #00758F;  /* cyan as text on light grounds */
  --sap:        #A8D93C;  /* gradient tail and accent rules ONLY, never text */

  /* Neutrals — cyan-biased, not pure grey */
  --slate:      #3E5460;  /* body copy on light */
  --steel:      #8FA3AE;  /* captions, metadata */
  --mist:       #E6EDF0;  /* hairline rules, borders */
  --paper:      #F6F9FA;  /* light ground — never pure white */

  --grad: linear-gradient(90deg, #00A9D6, #4CC9B0, #A8D93C);
}
```

### Contrast — measured, not assumed

| Foreground | Ground | Ratio | Verdict |
|---|---|---|---|
| `--ink` | `--paper` | 16.9:1 | Body and display |
| `--slate` | `--paper` | 7.9:1 | Body |
| `--cyan-deep` | `--paper` | 5.3:1 | Body and links |
| `--cyan` | `--ink` | 6.2:1 | Body on dark |
| `--sap` | `--ink` | 10.2:1 | Body on dark |
| **`--cyan`** | **`--paper`** | **2.8:1** | **Graphic elements only — never text** |
| **`--sap`** | **`--paper`** | **1.7:1** | **Never** |

**The rule to internalise: bright colours belong on the dark ground, dark colours on the
light one.** The 2019 brand failed because it had nine light aquas and no anchor.

## 3. Section rhythm — alternating grounds

The page alternates between dark and light sections. This is the site's structural
signature and it is not decorative — it gives a long scroll rhythm and lets each of the
two audiences find its register.

- **Hero: dark (`--ink`), SVG-native.** No photography. The node-graph motif.
- Thereafter alternate. Dark sections carry the security and work content; light sections
  carry services, process and pricing.
- Every section declares its own ground and takes *all* its colours from the matching set.
  A colour whose only definition assumes the other ground is the classic bug.
- Transitions between grounds are hard edges or the gradient rule — never a soft fade,
  which reads as indecision.

## 4. The recurring device — the node graph

Points converging is the company name, the logo's argument, and already exists in
`ndalamahub_lms_app` `client/src/components/auth/AuthLayout.jsx`.

- Built as **inline SVG**: paths, circles, one radial gradient halo, layered at different
  opacities to create depth. No images, no extra requests.
- Parameterise it — node count, density, opacity, seed — so sections can share the device
  without repeating markup.
- It is a background device. It never competes with type for attention.

## 5. Typography

| Role | Face | Notes |
|---|---|---|
| Display, headings, wordmark | **Sora** 600 / 700 | Tight tracking, `-0.025em` at display sizes |
| Body, UI | **IBM Plex Sans** 400 / 500 | 65ch max measure |
| Labels, figures, metadata | **IBM Plex Mono** 400 | `0.16em` tracking, uppercase |

All three are SIL Open Font License — free to self-host and embed.

### The font budget — decide in Phase 2, do not discover at audit

Raw TTFs are 46 KB (Sora) and 183 KB (IBM Plex Sans) **per weight**. Unusable as shipped.

- **Latin-subset WOFF2 only.** Target 15–25 KB per face.
- **Cap at three or four weights total** across the entire site.
- **IBM Plex Mono is the candidate to drop** to a system mono stack
  (`ui-monospace, "SF Mono", Menlo, monospace`) on mobile. It carries labels and figures,
  where a fallback costs least. Make this call explicitly and record it in DECISIONS.md.
- Self-host. `font-display: swap`. Preload **only** faces used above the fold.

### Type scale

Fluid, `clamp()`-based. Headings get `text-wrap: balance`. Uppercase mono labels get
letter-spacing or they read as shouting.

## 6. Motion

### The rule

Native CSS only. **No animation library** — GSAP is ~70 KB gzipped before a line is
written, and it buys nothing here.

### Scroll-driven animation

```css
@supports (animation-timeline: scroll()) {
  .reveal { animation: reveal linear both; animation-timeline: view(); animation-range: entry 10% cover 40%; }
}
```

Support verified 2026-09-05: ~84% global; Chrome/Edge 115+, Safari 18+. **Firefox is still
behind a flag in stable.** So:

- Everything sits behind `@supports (animation-timeline: scroll())`.
- The fallback is an **IntersectionObserver** that adds a class for a simple fade/rise.
  It is not a reimplementation — it is a plainer, cheaper version of the same intent.
- Without either, content is simply visible. Never `opacity: 0` as the default state
  outside a supports/JS guard, or non-supporting browsers get a blank page.

### The signature moment — the BazaBooks phone

A real product screenshot in a **CSS-drawn phone frame**, with `perspective` +
`rotateY`/`rotateX` driven by scroll position. One WebP, ~30 KB, reads as 3D.

This is the one memorable interaction. Everything around it stays quiet — sites that read
as accomplished have a single moment executed extremely well, not effects everywhere.

### Horizontal sections

`position: sticky` on a tall parent plus a scroll-linked `translateX` on the track.
**Never hijack the scroll.** No `scroll-behavior` overrides, no wheel-event interception,
no smooth-scroll library. That is what feels broken on low-end Android.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
```

Every animated element must be checked with the setting on. Content must still be
reachable and legible; the horizontal section must still be navigable.

### What to animate

Only `transform` and `opacity`. Both composite on the GPU. Animating `width`, `height`,
`top`, `left`, `margin` or `box-shadow` forces layout or paint on every frame and is the
difference between smooth and unusable on a budget Android device.

## 7. Accessibility — WCAG 2.1 AA, non-negotiable

Nexus sells accessibility audits as a deliverable. The company's own site failing one
would be indefensible.

- Every interactive element has a visible focus state. Never `outline: none` without a
  replacement.
- Colour is never the only carrier of meaning.
- Images have real alt text; decorative SVG gets `aria-hidden="true"`.
- Horizontal scroll sections must be operable by keyboard.
- Verified with `a11y --full` before launch, not assumed.

## 8. Responsive

- Mobile-first. The 360–390 px Android viewport is the primary design target, not an
  afterthought — it is what most of this market actually browses on.
- Fluid type and spacing via `clamp()`; avoid breakpoint-hopping type sizes.
- Wide content (tables, code, diagrams) scrolls inside its own `overflow-x: auto`
  container. **The page body never scrolls sideways.**
- Touch targets ≥ 44 px.

## 9. What we are deliberately not doing

Recorded so a later session does not "improve" the site by adding them back:

- No 3D renders, fluid blobs or WebGL. This is what made the reference sites slow.
- No video hero.
- No smooth-scroll library.
- No carousel that auto-advances.
- No cookie banner — because no third-party tracking. If analytics are ever added, choose
  something that does not require consent.
- No stock photography of people in offices.
