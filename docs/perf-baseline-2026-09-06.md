# Performance baseline — 2026-09-06

First recorded baseline (no prior file to diff against). Measured against
`docs/PERFORMANCE-BUDGET.md`, Phase 7 (`p7-perf`).

## Build-size budget (`npm run budget`)

```
HTML files: 9
CSS + JS critical path (gzip): 4.6 KB / budget 100.0 KB
JS files in dist: 0 (none — zero third-party JS holds)
Fonts total: 75.1 KB / budget 80.0 KB (4 files)
Budget check passed.
```

Whole `dist/` is 272 KB across 9 routes. Per-page HTML: home 20 KB, styleguide
28 KB (not shipped to nav), services/security-awareness 16 KB, work/about/contact
12 KB, case studies 8 KB each.

## Lighthouse — mobile, simulated throttling (`astro preview`, production build)

Tool: `npx lighthouse@13.4.1`, `--preset=perf --form-factor=mobile
--screenEmulation.mobile --throttling-method=simulate`.

| Route | Score | LCP | CLS | TBT | FCP | TTI | Page weight |
|---|---|---|---|---|---|---|---|
| `/` (home) | 0.97 | 1.4 s | 0 | 160 ms | 1.1 s | 1.4 s | 65 KiB |
| `/services/security-awareness/` | 1.00 | 1.4 s | 0 | 0 ms | 1.4 s | 1.4 s | 87 KiB |

Both routes clear the < 2.5 s LCP budget with headroom. CLS is 0 on both — no
unsized images, no injected content.

## Findings

**Minor — render-blocking CSS on home.** `_astro/Reveal.BQzrp_1U.css` (4.9 KB)
loads render-blocking, Lighthouse estimates ~159 ms wasted. Given the 100 KB
critical-path budget has 95 KB of headroom, and LCP is already 1.1 s under
budget, not worth inlining at the cost of Astro's default per-component CSS
extraction. Revisit only if a future page pushes LCP close to budget.

**Not checked — HTTP cache headers.** No Dockerfile/nginx/Coolify config exists
yet in this repo (confirmed via search — infra is a Phase 8 task). Long
`Cache-Control` on static assets (`p8-deploy` territory) should be verified once
the Coolify service config exists, not assumed from this static-file audit.

**Already good:**
- All four font weights `font-display: swap`, self-hosted, Latin-subset WOFF2.
- Two `<link rel=preload>` for the above-the-fold weights (Sora 700, Plex 400) —
  matches actual hero usage, no wasted preload.
- The one raster image (`bazabooks-screen.webp`) has explicit `width`/`height`,
  `loading="lazy"`, `decoding="async"`.
- Zero third-party JS. The only script on any page is the ~350-byte
  `IntersectionObserver` fallback for `.reveal`, gated behind
  `CSS.supports('animation-timeline','scroll()')` — the one justified island
  from Phase 3, not a new finding.
- No CLS anywhere measured.

## Verdict

Performance is not a blocker for `/ship`. No 🔴 critical or 🟡 moderate findings.
