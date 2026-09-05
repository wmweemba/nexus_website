# Decisions

Newest at the top. Every non-obvious choice gets an entry with the reasoning — sessions
are separate, and the reasoning is the only thing that survives between them.

Format: **date — decision**, then why, then what it rules out.

---

## 2026-09-05 — IBM Plex Mono dropped sitewide, not just on mobile

`p2-mono`, decided during Phase 2. The system mono stack
(`ui-monospace, "SF Mono", Menlo, monospace`) was already the default from Phase 0
pending this call. Confirmed rather than reversed: mono type on this site only ever
carries labels, captions and figures — never a reading experience where face identity
matters — so the fallback costs nothing perceptible against a real request and file-size
line in the font budget. Desktop gets no exception; a stack that differs by breakpoint is
one more thing to drift.

**Rules out:** self-hosting IBM Plex Mono at all. If a future page needs genuine
code/data-table typography where the system stack looks inconsistent across OSes, that's
a new decision, not a reopening of this one.

## 2026-09-05 — Nav has no disclosure widget; it always renders full and wraps

`p2-nav`. Considered a `<details>/<summary>` hamburger (no JS, semantically a disclosure
widget) but rejected it: overriding a `details` element's native show/hide behaviour
across breakpoints relies on undocumented browser-specific behaviour, and Opera Mini's
near-zero CSS support (real share on low-end Android in this market, per CLAUDE.md) makes
an unusual pattern risky to trust sight-unseen. Nexus's nav is four links — small enough
that a flex-wrapped row degrades to two short lines on a 360px viewport without needing a
collapse mechanism at all.

**Rules out:** any nav treatment that depends on JS or on relying on `details` rendering
consistently without a live cross-browser check.

## 2026-09-05 — Section-ground colour rules must never nest opposite grounds

Found live while building `/styleguide`: `.section[data-ground='dark'] .btn-ghost` and
`.section[data-ground='light'] .btn-ghost` share identical specificity (0,2,0). When a
page nests a `data-ground="dark"` element inside a `data-ground="light"` ancestor (as the
first draft of the styleguide's button demo did), CSS resolves the tie by **source
order**, not DOM proximity — the rule declared later in the stylesheet wins regardless of
which ground is actually closer. The dark demo box silently rendered with light-ground
button colours.

**Fix:** never nest a `data-ground` element inside an ancestor with the other value.
`docs/UI_UX_SPEC.md` §3 already says "every section declares its own ground" — this
makes explicit that the rule is load-bearing for correctness, not just visual rhythm.
Any component that must preview the opposite ground (styleguide, a card floating over the
other section's background) needs its own explicit override selector, not a bare
`data-ground` swap.

**Rules out:** ad hoc `data-ground="dark"` wrapper `<div>`s dropped inside light sections
for one-off contrast. Use a real `<Section ground="dark">` instead.

## 2026-09-05 — Site information architecture, locked from the SEO audit

Full audit: `docs/SEO-AUDIT-2026-09.md`. Routes:

```
/                              home
/services/                     six-pillar overview + pricing shape
/services/security-awareness/  dedicated wedge landing page
/work/                         case-study index
/work/ndalamahub/              case study
/work/[tbc]/                   second case study — blocked on p5-consent
/about/                        team, positioning, small-on-purpose framing
/contact/                      scoping-call CTA, no-JS-fallback form
```

**Why a dedicated `/services/security-awareness/` route** rather than folding it into one
`/services/` page: the audit found the compliance/phishing-simulation keyword cluster is
materially less contested than general Lusaka web-design search, and it is the wedge the
whole positioning is built on. A page with its own title tag, meta description and the
Bank of Zambia's 31 May 2023 Cyber and Information Risk Management Guidelines cited by
name earns its own route. This extends `p5-services` in the build plan from one page to
two; the effort is one extra static page, not a new phase.

**Old-URL redirects are simpler than assumed.** `/about/` and `/contact/` on the new site
use the same paths as the old WordPress site, so `p6-redirects` needs no rewrite rule for
them — only the 410s for `/scan/`, `/ncs/`, `/3cx/` and the three blog posts stand.

**Rules out:** a blog/insights section at launch. The audit found real, uncontested
keyword demand around Zambia Data Protection Act compliance, but it is net-new content
production with no existing draft — out of scope for a two-weekend build. Logged so a
later session doesn't rediscover it as a gap.

## 2026-09-05 — Tailwind v4 content scan scoped to `src/`

Confirmed the NS-010 trap live during Phase 0: Tailwind v4's automatic content
detection scans the whole project by default, and it generated real (dead) CSS for
`.bg-\[--token\]` — the literal example string from this repo's own CLAUDE.md — because
that file sits in the scanned root. `grep` in CLAUDE.md caught it in `dist/**/*.css`.

**Fix:** `@import "tailwindcss" source("../");` in `src/styles/global.css`, scoping
detection to `src/` only. Rebuilt clean — the grep now returns nothing.

**Rules out:** leaving Tailwind's default whole-repo scan in place. Any future doc that
mentions a Tailwind class pattern as prose risks the same false positive.

## 2026-09-05 — Fonts: Sora 600/700 + IBM Plex Sans 400/500, self-hosted

Extracted Latin-subset WOFF2 files from the published `@fontsource/sora` and
`@fontsource/ibm-plex-sans` packages (5.3.0) into `public/fonts/`, then removed the
packages from `package.json` — they were only needed as an extraction source, not a
runtime dependency. Actual byte cost: Sora 600 15.0 KB, Sora 700 14.8 KB, Plex Sans 400
22.1 KB, Plex Sans 500 23.6 KB — **75.1 KB total**, under the 80 KB budget.

IBM Plex Mono deferred to `p2-mono` per the build plan; `--font-mono` currently resolves
to the system mono stack (`ui-monospace, "SF Mono", Menlo, monospace`).

## 2026-09-05 — Astro, static output, markdown content, no CMS

Ships zero JavaScript by default, which is the constraint the whole project is built
around. Content collections give typed markdown for case studies without a database, an
admin login to secure, or a service to keep patched. Builds to static files that deploy to
Coolify trivially.

**Rules out:** Next.js (ships a JS runtime and hydration even for static pages — fighting
the framework to hit the payload budget), and any headless CMS (a service to run, secure
and pay for, justified only if someone other than William edits).

**Cost accepted:** Astro is new to William, who is a MERN specialist. Syntax is close to
JSX; Phase 0 is timeboxed to absorb the learning curve.

## 2026-09-05 — Dark SVG-native hero, then alternating light/dark sections

Takes the dark register from the Lumier/Blvck references but builds every graphic as SVG
rather than photography or 3D. Alternating grounds give a long scroll rhythm and let the
two audiences — regulated-sector buyers and website shoppers — each find their register.

**Rules out:** full-bleed photographic heroes, 3D fluid blobs, WebGL. These are exactly
what made the reference sites slow on a Starlink connection, which is what prompted the
change of direction.

## 2026-09-05 — Native CSS scroll-driven animations, no animation library

`animation-timeline: view()/scroll()` runs on the compositor, off the main thread, and
costs zero bytes. GSAP is ~70 KB gzipped before a line is written.

Support verified 2026-09-05: ~84% global, Chrome/Edge 115+, Safari 18+, **Firefox behind a
flag in stable**. Therefore everything is gated behind
`@supports (animation-timeline: scroll())` with an IntersectionObserver fallback, and
content is visible by default without either.

**Rules out:** GSAP, ScrollTrigger, Framer Motion, Lenis, Locomotive, AOS.

## 2026-09-05 — Performance budget is a design constraint, not a target

100 KB critical path, LCP < 2.5 s on Slow 4G, zero third-party JS. Set before any design
work so ideas are shaped by it rather than trimmed to it afterwards.

Reasoning: the price list and company profile both promise clients fast sites on Zambian
mobile connections. A slow site here disproves Nexus's own sales copy publicly.

## 2026-09-05 — Old URLs are a free hand

`/scan/`, `/ncs/` and `/3cx/` were experiments with no live data. The only three blog
posts are two devotional pieces and a `hello-world` stub — none are business content and
the devotionals are off-brand for an ICT consultancy.

**Therefore:** no SEO equity to preserve, URL structure can be designed from scratch.
Redirect `/about/` and `/contact/` to their new equivalents; 410 the rest.

---

## Open — decide during the build

- **PWA / offline shell.** Genuine value on 2G, but not a launch blocker. Assess in
  Phase 7 on evidence, not assumption.
- **Case study client consent.** Naming ManifiPay and NdalamaHub in public case studies
  needs the client's agreement first.
