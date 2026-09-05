# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Phase 5 — remaining pages.

### Added

- `src/pages/services.astro`: services overview (`/services/`) — six service blocks in a
  dark grid, the five-step "how we work" process, and the three quoting shapes, from
  `docs/copy/services.md`.
- `src/pages/services/security-awareness.astro`: the wedge page
  (`/services/security-awareness/`) — the highest-priority page from the SEO audit, with
  its own title tag and meta description targeting the compliance keyword cluster rather
  than the general web-design one. From `docs/copy/security-awareness.md`.
- `src/pages/work/index.astro` and `src/pages/work/[slug].astro`: the case-study index and
  detail template, driven by `getCollection`/`getStaticPaths` over the `case-studies`
  content collection — only entries with `published: true` get a static path or a card.
  NdalamaHub and ManifiPay are both published; the security-awareness programme and the
  retainer book remain summary-only cards with no dedicated page, per
  `docs/copy/work.md`.
- `src/pages/about.astro`: about page (`/about/`) — three named team members, no implied
  department, delivery capacity attributed to William alone. From `docs/copy/about.md`.
- `src/pages/contact.astro`: contact page (`/contact/`) — a `mailto:` CTA as the sole,
  no-JS submission mechanism (no form backend), plus direct team emails. From
  `docs/copy/contact.md`. See `docs/DECISIONS.md` for why a form-backend service and a
  `mailto:`-action `<form>` were both ruled out.

### Changed

- `src/content/case-studies/manifipay.md`: flipped `published: false` → `true` — client
  consent confirmed (`p5-consent`). See `docs/DECISIONS.md`.

### Verified

- `npm run budget`: critical path 4.6 KB / 100 KB, 0 JS files in `dist`, fonts
  75.1 KB / 80 KB — passed.
- NS-010 grep against `dist/**/*.css`: no dead `bg-[--token]` output.
- `npm run build`: all 9 routes generate cleanly, including the two dynamic
  `/work/[slug]/` paths.
- All five new pages rendered and read back via the accessibility tree /
  page-text extraction — content matches the approved copy, no department implied on
  `/about/`, both case studies present on `/work/`.

Phase 4 — home page.

### Added

- `src/pages/index.astro`: full home page assembled from the approved copy in
  `docs/copy/home.md` — hero (with the node-graph device) and "the gap" as one
  continuous dark section, the security-awareness wedge (light), six services
  in a `HorizontalScroll` strip plus the BazaBooks phone as a "business systems"
  illustration (dark), selected work (light, NdalamaHub card + a no-consent-needed
  "more on file" note), and the closing scoping-call CTA (dark) — alternating
  grounds throughout, per `docs/UI_UX_SPEC.md` §3. See `docs/DECISIONS.md` for the
  BazaBooks-placement and horizontal-strip decisions.

### Fixed

- A scoped-CSS bug found live: positioning the node-graph device with a class
  passed straight into the `NodeGraph` component doesn't work — Astro only
  applies its scoping attribute to elements written directly in the page file,
  not to a child component's rendered markup, so the rule silently never
  matched and the SVG rendered full-size in normal document flow instead of as
  a background layer. Fixed by wrapping `<NodeGraph>` in a plain `<div
  class="hero-graphic">` and sizing the child `<svg>` via `:global()`.

### Verified

- `npm run budget`: critical path 4.5 KB / 100 KB, 0 JS files in `dist`, fonts
  75.1 KB / 80 KB — passed.
- NS-010 grep against `dist/**/*.css`: no dead `bg-[--token]` output.
- Full page content and heading hierarchy checked via the accessibility tree
  (h1 once, one h2 per section); section-ground colour pairing checked via
  computed styles (dark ground → paper text, light ground → ink text, at every
  section). Full Lighthouse mobile pass deferred to `p7-perf` — see
  `docs/DECISIONS.md`.

Phase 3 — the scroll system.

### Added

- `Reveal.astro`: scroll-in primitive. Native `animation-timeline: view()` where
  supported; an IntersectionObserver fallback (~350 bytes, the site's first
  JavaScript) everywhere else; plain and visible with neither. See
  `docs/DECISIONS.md`.
- `PhoneShowcase.astro`: the BazaBooks signature moment — a CSS-drawn phone frame
  tilted into place by `perspective` + scroll-linked `rotateY`/`rotateX`/`scale` via
  `animation-timeline: view()`. Screen graphic (`bazabooks-screen.webp`, 15.7 KB) is
  a real crop of BazaBooks' own live marketing hero, sourced from `payrush_saas_app`.
  See `docs/DECISIONS.md`.
- `HorizontalScroll.astro`: a native `overflow-x: auto` strip by default —
  keyboard-operable, no JS — enhanced to a `position: sticky` + scroll-linked
  `translateX` track (named `view-timeline`) where `animation-timeline` is
  supported. Never intercepts the scroll in either branch.
- `src/styles/scroll-system.css`: the CSS behind all three, with explicit
  `prefers-reduced-motion` overrides for each (verified via CDP media emulation —
  phone stays static, horizontal section collapses to a plain scrollable strip with
  no dead space, reveal resolves near-instantly).
- Demo sections for all three added to `/styleguide` for verification; not shipped
  to production navigation.

### Fixed

- A horizontal-section bug found live: `animation-timeline: scroll(nearest block)`
  ties progress to the whole document's scroll range, not the pinned section's own
  300vh — the track never moved. Fixed with a named `view-timeline` on the wrapper.
  See `docs/DECISIONS.md`.
- A phone-frame rendering bug found live: `border-radius` + `transform-style:
  preserve-3d` on the same element rendered the rounded top corners as two
  disconnected arcs under `rotateY` in Chromium. Fixed by removing `preserve-3d`
  (not needed — no child requires independent 3D positioning). See
  `docs/DECISIONS.md`.

Phase 2 — design system in code.

### Added

- Fluid type scale (`--text--1` … `--text-6`) and spacing scale (`--space-1` …
  `--space-12`, plus fluid `--space-section`/`--space-gutter`) as tokens in
  `src/styles/tokens.css`, registered into Tailwind via `@theme inline`. No
  breakpoint-hopping sizes — every step is `clamp()`-based.
- Section shell (`.section[data-ground]`, `src/components/Section.astro`): each section
  declares its own light/dark ground and takes all colours from the matching set. Seam
  between alternating sections is the brand gradient rule as a 2px hard edge, never a
  fade.
- `NodeGraph.astro`: the recurring converging-node-graph device as parameterised inline
  SVG (`nodeCount`, `density`, `opacity`, `seed`), deterministic via a seeded PRNG. Ported
  the approach from `ndalamahub_lms_app` `AuthLayout.jsx`.
- `Nav.astro` and `Footer.astro`: always-rendered link list, no disclosure widget, works
  identically with JavaScript disabled or on Opera Mini. Real contact/registration
  content from the approved copy, not placeholders.
- Button (`.btn-primary`/`.btn-ghost`) and chip (`.chip`) component classes, ground-aware.
- `/styleguide` route rendering every token, type step and core component — not shipped
  to production navigation.

### Fixed

- A CSS specificity trap where nesting a `data-ground="dark"` element inside a
  `data-ground="light"` ancestor let the wrong ground's button/chip colours win on
  source-order rather than DOM proximity. See `docs/DECISIONS.md`.

Phase 1 — content and SEO architecture.

- `docs/SEO-AUDIT-2026-09.md`: keyword research and content-gap analysis. Confirms the
  security-awareness wedge is the lowest-competition, highest-intent keyword cluster in
  this market, and surfaces the Bank of Zambia's Cyber and Information Risk Management
  Guidelines (gazetted 31 May 2023) as a citable regulatory anchor no competitor uses.
- Information architecture locked in `docs/DECISIONS.md`: seven routes, including a
  dedicated `/services/security-awareness/` landing page split out of the general
  services page on the audit's recommendation.
- Full page copy drafted for all seven routes in `docs/copy/` (home, services,
  security-awareness, work, about, contact), adapted from the approved 2026 company
  profile. Passed a `human-voice` review; one curly-quote/negative-parallelism fix made
  on the security-awareness draft.
- Astro content-collection schema for case studies (`src/content.config.ts`), with the
  NdalamaHub entry published and a ManifiPay entry drafted but unpublished pending
  client consent (`p5-consent`).

## [0.1.0] - 2026-09-05

Phase 0 — repo and foundations.

### Added

- Astro 7.3.1 project scaffold: static output, TypeScript strict.
- Tailwind CSS v4.3.3 via `@tailwindcss/vite`.
- Brand design tokens (`docs/UI_UX_SPEC.md` §2) as CSS custom properties, mapped into
  Tailwind's theme via `@theme inline`.
- Self-hosted, Latin-subset WOFF2 fonts: Sora 600/700, IBM Plex Sans 400/500 — 75.1 KB
  total, under the 80 KB budget. IBM Plex Mono deferred to Phase 2 (`p2-mono`).
- Build-size budget check script (`npm run budget`) against `docs/PERFORMANCE-BUDGET.md`.
- NS-008 repo registry entry in the second brain.

### Fixed

- Scoped Tailwind's content scan to `src/` (`@import "tailwindcss" source("../")` in
  `src/styles/global.css`) after confirming the NS-010 trap live: whole-repo scanning
  was generating real dead CSS from the literal `bg-[--token]` example string in this
  repo's own `CLAUDE.md`. See `docs/DECISIONS.md`.

### Security

- Ran `/sec --full`: 0 P0/P1 findings, 3 P2 (no exploitable issues on a static site with
  no database, auth, or user input yet).
- Removed the inert `allowScripts` key from `package.json` — not a field npm recognizes,
  so it provided no actual script-execution gating despite reading like one.
- `.npmrc` hardening (`ignore-scripts`, `min-release-age`) and `.dockerignore` deferred:
  the former has a real workflow cost (would block esbuild's required postinstall) for
  a repo with 0 audit findings; the latter has nothing to guard until Phase 8 adds a
  Dockerfile.
