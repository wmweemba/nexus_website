# Performance budget

**A design constraint, not an audit target.** If an idea cannot be built inside these
numbers, the idea changes.

## Why these numbers

Nexus's price list and company profile both promise clients "sites that load quickly on a
Zambian mobile connection". This site is the proof or the disproof, in public.

The market is Android-dominated, frequently on 3G, sometimes 2G, often on budget hardware
where CPU — not bandwidth — is the bottleneck. That is why the JavaScript rules below are
stricter than the byte rules: 100 KB of JS costs far more on a low-end phone than 100 KB
of image, because it has to be parsed, compiled and executed.

## The budget

| Metric | Budget | How measured |
|---|---|---|
| Critical path (HTML + CSS + JS), compressed | **≤ 100 KB** | Build output, gzip/brotli |
| First viewport total, incl. hero | **≤ 250 KB** | DevTools Network, first paint |
| Total page weight, home | **≤ 500 KB** | DevTools Network, load complete |
| LCP, throttled Slow 4G | **< 2.5 s** | Lighthouse mobile |
| CLS | **< 0.1** | Lighthouse |
| TBT | **< 200 ms** | Lighthouse |
| Third-party requests | **zero** | Network panel |
| Animation library bytes | **zero** | package.json |
| Fonts, total | **≤ 80 KB** | Latin-subset WOFF2, 3–4 weights |

## Hard rules

1. **No third-party JavaScript.** No analytics tag, no chat widget, no font CDN, no
   embedded map. Each is a DNS lookup, a TLS handshake and an unbudgeted payload on a
   connection that cannot afford any of them.
2. **Self-host everything**, fonts included.
3. **Images**: AVIF with WebP fallback, `srcset` with real breakpoints, explicit
   `width`/`height` to reserve space, `loading="lazy"` below the fold, `fetchpriority="high"`
   on the LCP image only.
4. **No layout-triggering animation.** `transform` and `opacity` only.
5. **An Astro island needs a written justification** in `docs/DECISIONS.md`. Zero JS is
   the default state, and every departure is a decision with a name on it.

## How to check

```bash
npm run build
du -sh dist                    # total
find dist -name '*.js' -exec ls -la {} +   # should be near-empty
```

Then `pa --full` for real Lighthouse measurement. **Measured, never asserted** — a build
that looks small is not evidence of a fast page.

Record each measurement in `docs/DECISIONS.md` with a date, so regressions are visible as
a trend rather than discovered at launch.

## Degraded environments

- **Opera Mini** retains meaningful share on low-end Android here and renders server-side
  with almost no CSS animation. The site must be readable and navigable with every effect
  absent.
- **Firefox** has scroll-driven animations behind a flag in stable as of 2026-09. The
  IntersectionObserver fallback is the load-bearing path there, not an edge case.
- **No JavaScript at all**: every page must render its full content. Nothing is
  JS-gated.
