# Decisions

Newest at the top. Every non-obvious choice gets an entry with the reasoning — sessions
are separate, and the reasoning is the only thing that survives between them.

Format: **date — decision**, then why, then what it rules out.

---

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

- **IBM Plex Mono on mobile.** Drop to a system mono stack to save a font request, or keep
  for brand consistency? Decide in Phase 2, record here. Do not discover it at audit.
- **PWA / offline shell.** Genuine value on 2G, but not a launch blocker. Assess in
  Phase 7 on evidence, not assumption.
- **Case study client consent.** Naming ManifiPay and NdalamaHub in public case studies
  needs the client's agreement first.
