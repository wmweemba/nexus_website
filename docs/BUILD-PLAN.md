# Build plan

**Canonical for execution.** The second brain
(`wsm-second-brain/ventures/nexus/website-2026/00-build-plan.md`) holds the strategic
record — why this exists, the positioning it serves. This file is what a session works from.

Progress is tracked on the interactive checklist (link in the brain doc). Checkbox ids
below match the checklist ids, so ticks and tasks stay aligned.

## How to use this

Each phase is self-contained: entry condition, tasks, exit condition. **A session should
be able to open one phase and execute it without reading the others.** Read `CLAUDE.md`
and `docs/UI_UX_SPEC.md` first regardless of phase.

**Scope reality.** At ~4 hours per weekend day, this does not ship in one weekend.
Weekend 1 ends at a coherent, demonstrable stopping point — foundations plus a finished
home page with the signature scroll moment. Weekend 2 completes it.
**The existing WordPress site stays live until `/ship` passes.**

---

# Weekend 1

## Phase 0 — Repo and foundations
`p0` · entry: empty repo · exit: `npm run dev` serves a styled blank page with brand tokens and subset fonts

- `p0-onboard` — Run `/onboard`. Security baseline scaffold, NS-008 registry row in the
  second brain, CHANGELOG.md. CLAUDE.md already exists — do not overwrite it, reconcile.
- `p0-astro` — `npm create astro@latest` — minimal template, TypeScript, static output.
  Pin dependencies to current-patched versions (Context7 lookup, not defaults).
- `p0-tailwind` — Add Tailwind v4. **⚠ NS-010: v4 dropped the `bg-[--token]` shorthand
  silently.** Use `bg-(--token)` or `@theme inline`. Verify with the grep in CLAUDE.md
  against built CSS before trusting anything.
- `p0-tokens` — Brand tokens as CSS custom properties from `docs/UI_UX_SPEC.md` §2.
  One source, no hardcoded hex anywhere else.
- `p0-fonts` — Subset Sora + IBM Plex Sans to Latin WOFF2. Cap at 3–4 weights total.
  Self-host, `font-display: swap`, preload only above-the-fold faces. Record the byte
  cost in DECISIONS.md. Decide the IBM Plex Mono question here or defer to `p2-mono`.
- `p0-budget` — Add a build-size check to package.json scripts so the budget is
  measurable from day one, not at audit.
- `p0-verify` — Screenshot the blank styled page. Confirm tokens resolve and fonts load.
  A green build is not evidence.

## Phase 1 — Content and SEO architecture
`p1` · entry: Phase 0 exit · exit: sitemap of pages agreed, all copy drafted, content schema defined

- `p1-seo-audit` — Run `marketing:seo-audit`. Keyword research for Zambian buyers,
  competitor content gaps, what regulated-sector buyers actually search.
  **This runs before any page is built** so structure follows demand rather than being
  retrofitted.
- `p1-ia` — Information architecture and URL structure derived from the audit.
  Old URLs are a free hand — see DECISIONS.md 2026-09-05.
- `p1-copy` — Draft all page copy. **Most of this already exists**: the company profile
  (`Nexus Consulting Services/Company Profile/2026 Rebrand/`) is effectively the site's
  content. Adapt, do not rewrite from scratch.
- `p1-voice` — Run `human-voice` over all drafted copy before it is committed.
- `p1-schema` — Define the Astro content collection schema for case studies.

## Phase 2 — Design system in code
`p2` · entry: Phase 1 exit · exit: a styleguide route renders every token, type step and core component

- `p2-direction` — Run `frontend-design` for aesthetic calls within the spec's bounds.
- `p2-scale` — Type scale and spacing scale as tokens. Fluid `clamp()`, no
  breakpoint-hopping sizes.
- `p2-sections` — The light/dark section shell. Each section declares its ground and
  takes all colours from the matching set. See UI_UX_SPEC §3.
- `p2-nodegraph` — The node-graph SVG device, parameterised (node count, density, opacity,
  seed). Port the approach from `ndalamahub_lms_app`
  `client/src/components/auth/AuthLayout.jsx` — inline SVG, no images.
- `p2-nav` — Navigation and footer. Nav must work without JavaScript.
- `p2-mono` — **Decide: IBM Plex Mono on mobile, or system mono stack?** Record in
  DECISIONS.md either way.
- `p2-styleguide` — A `/styleguide` route rendering every token and component. Not
  shipped to production, but the fastest way to catch drift.

## Phase 3 — The scroll system
`p3` · entry: Phase 2 exit · exit: signature moment works, degrades correctly in 3 conditions
**Timebox this phase.** Highest risk and highest creative value. If the signature moment
is not working by the cutoff, ship the fallback and revisit in Weekend 2.

- `p3-primitives` — Reveal primitives behind `@supports (animation-timeline: scroll())`,
  with an IntersectionObserver fallback. **Content visible by default without either** —
  never `opacity: 0` outside a guard.
- `p3-phone` — The BazaBooks phone. Real screenshot, CSS-drawn frame, `perspective` +
  `rotateY` driven by scroll. One WebP, ~30 KB. See UI_UX_SPEC §6.
- `p3-horizontal` — One horizontal section: `position: sticky` + scroll-linked
  `translateX`. **Never hijack the scroll.** Must be keyboard-operable.
- `p3-reduced` — `prefers-reduced-motion` variants for every effect. Test with the setting
  on — content reachable, horizontal section still navigable.
- `p3-degrade` — Verify three conditions explicitly: (1) Firefox / no scroll-timeline,
  (2) JavaScript disabled, (3) reduced motion. Screenshot each.

## Phase 4 — Home page
`p4` · entry: Phase 3 exit · exit: **deployable home page — Weekend 1 stopping point**

- `p4-assemble` — Home page end to end with real copy from `p1-copy`.
- `p4-craft` — Run `web-craft` as the implementation quality bar.
- `p4-measure` — First real measurement against the budget. `npm run build`, check
  `dist` size, run a Lighthouse mobile pass. Record the numbers in DECISIONS.md.
- `p4-mobile` — Verify on a real 360–390 px viewport, throttled. This is the primary
  design target, not a check at the end.

---

# Weekend 2

## Phase 5 — Remaining pages
`p5` · entry: Phase 4 exit · exit: all routes built and content-complete

- `p5-services` — Services page.
- `p5-work` — Work / case studies index.
- `p5-about` — About page. Team is William (Managing Consultant), Elias Mulenga (CTO,
  non-operational) and Farai Liwewe (Director, non-operational). **Do not imply a
  department** — delivery capacity is William alone, and the honest small-team framing is
  deliberate.
- `p5-contact` — Contact page. Form needs a no-JS fallback or a mailto path.
- `p5-casestudy` — Case study template plus two real studies.
  **`p5-consent` — confirm client consent before naming ManifiPay or NdalamaHub.**

## Phase 6 — Findability
`p6` · entry: Phase 5 exit · exit: `online-visibility` audit passes clean

- `p6-visibility` — Run `online-visibility`. robots.txt, sitemap.xml, **llms.txt**,
  canonical URLs, Open Graph, meta.
- `p6-schema` — Schema.org JSON-LD: Organization, LocalBusiness, Service, BreadcrumbList.
  Use the real PACRA (120200003611) and address.
- `p6-ai` — AI-crawler directives.
- `p6-redirects` — Redirect map for the old URLs. `/about/` and `/contact/` to their new
  equivalents; 410 `/scan/`, `/ncs/`, `/3cx/` and the three posts.

## Phase 7 — Verification
`p7` · entry: Phase 6 exit · exit: all audits pass or findings are triaged with a written decision

- `p7-perf` — `pa --full`. Real Lighthouse numbers against
  `docs/PERFORMANCE-BUDGET.md`. **Measured, not asserted.**
- `p7-a11y` — `a11y --full`. WCAG 2.1 AA. Nexus sells accessibility audits; the company
  site failing one is indefensible.
- `p7-qa` — `qa --full`. Visual regression across three viewports, console-error
  assertion.
- `p7-sec` — `sec`. Security headers, dependency audit, no tracked env files.
- `p7-pwa` — `pwa` **assess only**. An offline shell has genuine value on 2G but is not a
  launch blocker. Decide on evidence and record in DECISIONS.md.

## Phase 8 — Ship
`p8` · entry: Phase 7 exit · exit: live on mynexusgroup.com, logged

- `p8-ship` — `/ship` full gate. One consolidated go/no-go with a P0 blocker list.
- `p8-deploy` — Deploy to Coolify. Verify on the Coolify URL before touching DNS.
- `p8-dns` — DNS cutover **only after the gate passes**.
- `p8-rollback` — Keep the WordPress site recoverable for one week after cutover.
- `p8-log` — `/brain log` and push.
