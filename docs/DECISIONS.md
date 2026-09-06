# Decisions

Newest at the top. Every non-obvious choice gets an entry with the reasoning — sessions
are separate, and the reasoning is the only thing that survives between them.

Format: **date — decision**, then why, then what it rules out.

---

## 2026-09-06 — sitemap.xml is a generated endpoint, not a static file

`p6-visibility`. `src/pages/sitemap.xml.ts` builds the URL list from `getCollection`
against the `case-studies` collection at build time, rather than a hand-maintained
`public/sitemap.xml`. The collection is the one piece of site content the build plan
explicitly expects to grow (`src/content.config.ts`'s own comment says as much) — a static
file would silently drift the first time a case study is added or unpublished. Astro
prerenders the endpoint to a static file at build time since the whole site builds with
`output: 'static'`, so this costs nothing at runtime.

**Rules out:** a hand-maintained `public/sitemap.xml`, which is what `robots.txt` and
`llms.txt` are — those only ever reference fixed metadata (crawler names, the company
description), nothing that changes when a case study is added.

## 2026-09-06 — Plain-text SEO files use ASCII hyphens, not em dashes

`p6-visibility`. `public/robots.txt` and `public/llms.txt` are served with
`Content-Type: text/plain` and no `charset` parameter (confirmed via `curl -sI` against
both the Astro dev server and the built `dist/` output) — browsers without an explicit
charset fall back to guessing, and rendered every em dash in both files as `â€"` mojibake.
HTML pages are unaffected (`<meta charset="utf-8">` in `Seo.astro` settles it explicitly),
and the sitemap XML declares its own `encoding="UTF-8"` regardless of the HTTP header. Since
this repo has no web-server config yet to fix the header at the source (`p8-deploy`), the
two plain-text files were rewritten with ASCII `-` instead of `—` — a fix that holds
regardless of whatever server ships in Phase 8.

**Rules out:** relying on Phase 8's eventual server config to add
`Content-Type: text/plain; charset=utf-8` — cheaper to make the files immune to the
problem now than to depend on a config decision three phases away.

## 2026-09-05 — ManifiPay case study published; client consent confirmed

`p5-consent`. `src/content/case-studies/manifipay.md` was drafted with `published: false`
pending written client consent to be named publicly (per the build plan gate). Consent was
confirmed before `p5-casestudy`, so the entry is flipped to `published: true` and
`/work/manifipay/` is built alongside `/work/ndalamahub/`, both routed through the same
`getStaticPaths` in `src/pages/work/[slug].astro`.

**Rules out:** shipping `/work/` with NdalamaHub as the only linked case study, which was
the fallback the build plan specified if consent had not landed yet.

## 2026-09-05 — Contact page: mailto is the only submission mechanism, no form backend

`p5-contact`. A static site with no server has nothing to receive a form `POST`, and the
only real alternative — a hosted form backend (Formspree or similar) — is a third-party
account this repo doesn't have and a dependency CLAUDE.md's zero-JS/zero-third-party
posture doesn't ask for. `/contact/` instead leads with a `mailto:` link
(`mailto:info@mynexusgroup.com?subject=...&body=...`) as the primary CTA, prefilled with a
subject and a body template, plus a checklist of what to include. This is functional with
zero JavaScript, no external account, and no broken submit — the risk a same-page `<form
method="GET" action="mailto:">` carries, since mail clients only honour a handful of
recognised keys (`subject`, `body`, `cc`) and silently drop named fields like
"organisation," producing an email that looks like it worked but arrives incomplete.

**Rules out:** a real `<form>` posting anywhere (no backend to receive it), and a
`mailto:`-action form with named fields (silently drops data the visitor thinks they sent).
**Revisit:** if a hosted form service is ever justified for another reason, wire the same
fields into it as a progressive enhancement — the mailto CTA should stay as the no-JS
fallback either way.

## 2026-09-05 — Home page: BazaBooks phone illustrates "Business systems", not "Selected work"

`p4-assemble`. `docs/copy/home.md` never names BazaBooks — the phone showcase built in
Phase 3 has no assigned home in the approved copy. Placed it inside the "Six things, one
team" section, next to the "Business systems" item, with a plain-text caption identifying
it as "one of our own builds" rather than a client deliverable. Deliberately kept it out
of "Selected work": that section is about client engagements (NdalamaHub, the unnamed
security-awareness programme), and BazaBooks is William's own product — captioning it as
work delivered *for* a client would misrepresent it.

**Rules out:** dropping the phone into the work/case-study section for lack of a better
slot. If BazaBooks copy is ever added to the site, this placement is worth revisiting, not
assumed correct forever.

## 2026-09-05 — Home page: six services rendered as a horizontal-scroll strip, not a grid

`p4-assemble`. `docs/copy/home.md` describes a "six-item grid", but the horizontal-scroll
primitive built in `p3-horizontal` had no production use yet outside `/styleguide`. Six
short service cards are a good fit for the pattern (each card is self-contained, order
doesn't carry meaning beyond the list), and it exercises the component on the flagship
page rather than leaving it as a styleguide-only demo. Un-enhanced behaviour is the same
native `overflow-x: auto` strip verified in Phase 3 — full content still reachable without
JS or scroll-timeline support.

**Rules out:** treating "grid" in the copy doc literally where a component built for this
exact shape of content already exists and is better exercised in production.

## 2026-09-05 — Phase 4 measurement: build-size budget passed; full Lighthouse deferred to Phase 7

`p4-measure`. `npm run budget` against the real assembled home page: critical-path CSS+JS
(gzip) 4.5 KB against a 100 KB budget; 0 JS files in `dist` (Reveal's ~350-byte script is
inlined per-page, not a separate request); fonts 75.1 KB against 80 KB. `dist/index.html`
is 17.8 KB uncompressed, 5.2 KB gzipped.

No Lighthouse CLI is available in this session's sandbox (no network install attempted —
out of scope for a quick in-session check), and the Browser-pane tooling available here
doesn't expose a Lighthouse run. Real Lighthouse mobile numbers are deferred to `p7-perf`
(`pa --full`), which is the canonical performance-audit phase and already scoped for this.
Recorded here so a later session doesn't assume this number was measured when it wasn't.

**Rules out:** asserting an LCP or Lighthouse score without having actually run it — the
build-size numbers above are real measurements; the Lighthouse figures in the budget table
are not yet.

## 2026-09-05 — Horizontal section uses a named `view-timeline`, not `scroll()`

`p3-horizontal`. First implementation set `animation-timeline: scroll(nearest block)`
on `.hscroll-track` — this ties progress to the *whole document's* scroll range (0% at
top of page, 100% at bottom), not to how far the reader has scrolled through the
300vh `.hscroll` wrapper itself. Confirmed live: `getComputedStyle(track).transform`
stayed `none` after 900px of scrolling.

**Fix:** `view-timeline-name: --hscroll-progress` on the tall `.hscroll` wrapper,
referenced as `animation-timeline: --hscroll-progress` on the track, with
`animation-range: cover 0% cover 100%`. A view-timeline tracks the visibility of its
*own* subject element crossing the viewport — exactly the 300vh scroll distance we
want mapped to 0–100% track movement — where a bare `scroll()` timeline tracks the
nearest scroller's total scroll range regardless of element position.

**Rules out:** reaching for `scroll()` for any "pin this section and drive a
transform as the reader scrolls through it" pattern on this site. That pattern is
always a named `view-timeline` on the pinned wrapper, referenced by name on the
element actually being transformed.

## 2026-09-05 — BazaBooks phone frame: no `transform-style: preserve-3d`

`p3-phone`. The frame's `border-radius` combined with `transform-style: preserve-3d`
on the same element rendered visibly broken in Chromium — the rounded top corners
painted as two disconnected arcs instead of one continuous curve once `rotateY` was
applied. `preserve-3d` is only needed when child elements must occupy independent
positions in 3D space; the notch and screenshot here are just flat layers riding
along with their parent's transform, so removing it (default `flat`) fixes the
corner rendering with no visual loss. `perspective` stays on the `.phone-stage`
wrapper — that's what creates the depth for the child's rotation.

**Rules out:** adding `preserve-3d` to `.phone-frame` again without a concrete need
for a child to be positioned independently in the 3D space (there is none here).

## 2026-09-05 — BazaBooks phone screenshot: real asset, sourced from BazaBooks' own repo

`p3-phone`. First pass shipped a placeholder SVG because no standalone BazaBooks
screenshot asset existed: the only material in
`wsm-second-brain/ventures/saas/bazabooks/fliers/` is composite marketing flier art
at 1080×1350 with copy baked in (its own README calls flier 4 "a hand-built mock…
not a real screenshot"), and `marketing_sales_assets/bazabooks/` (Google Drive, per
NS-008) turned out to hold social-post graphics for the awareness campaign, not app
screens.

**Resolved by going to `payrush_saas_app` itself** (the actual BazaBooks repo — the
second brain's venture notes reference it by that name throughout
`ventures/saas/bazabooks/RUNBOOK.md`). Its `client/public/og-cover.webp` — the
site's own social-share image — captures the live landing page's hero graphic: an
illustrative "Acme Corp" invoice card (`ZMW 4,500.00`, line items, a "View invoice"
button) that BazaBooks already uses as its own product visual. Rather than
downscaling the flat OG image, fetched the same element live from
bazabooks.nxhub.online and took a DOM-scoped screenshot of just the invoice-card
element (`div.rounded-[24px].overflow-hidden.bg-white`, the floating "payment
received" toast hidden first so it doesn't bleed into the crop), then exported it as
WebP via Pillow — `public/images/bazabooks-screen.webp`, 540×1160, 15.7 KB, under the
~30 KB target.

**No consent question:** this is William's own product's own marketing asset, not a
client deliverable — unlike the NdalamaHub/ManifiPay case studies gated on
`p5-consent`. The sample data (Acme Corp) was already illustrative on BazaBooks' own
site, not a real customer's invoice.

**Rules out:** treating a screenshot gap as a phase blocker before checking whether
the product's own repo already has the asset in some other guise (an OG image, a
build artifact) — check there before mocking one up from a style guide.

## 2026-09-05 — Reveal primitive ships one small first-party script

`p3-primitives`. `docs/UI_UX_SPEC.md` §6 specifies an IntersectionObserver fallback
for browsers without native `animation-timeline` support (Firefox stable, ~16%
global per the earlier support check). This is the site's first JavaScript, so per
CLAUDE.md rule 1 it needs justification here: `src/components/Reveal.astro` ships a
~350-byte inline script, gated behind `!CSS.supports('animation-timeline','scroll()')`,
that adds a fade/rise class via IntersectionObserver. Astro inlines and dedupes it —
one copy per page regardless of how many `<Reveal>` instances it contains. If the
script never runs (disabled, or blocked), `.reveal` elements carry no opacity rule at
all and render plainly visible — verified directly via CDP script-execution
disabling. The BazaBooks phone and horizontal-scroll components needed no JS at all:
the phone's tilt is pure decorative CSS transform (never hides content), and the
horizontal section's non-enhanced state is a real `overflow-x: auto` strip.

**Rules out:** any animation library or a hand-rolled scroll-position listener for
this — this is strictly a plainer version of what native CSS already does for ~84%
of browsers.

## 2026-09-05 — Horizontal section's un-enhanced default is a real scroll strip, not a broken sticky container

`p3-horizontal`. The first draft put the tall `.hscroll` wrapper (300vh) and the
`position: sticky` pin unconditionally, then tried to drive the track's transform
only inside `@supports (animation-timeline: scroll())`. In a non-supporting browser
that leaves a pinned, `overflow: hidden` container with a track that never moves —
300vh of dead scroll distance with the later cards permanently unreachable, which
also breaks keyboard operability.

**Fix:** the base (un-enhanced) rules are a plain `overflow-x: auto` strip —
`height: auto`, no sticky, `scroll-snap-type: x proximity`, `tabindex="0"` +
`role="group"` on the scroller for keyboard access. The sticky/tall-wrapper/
scroll-linked-transform version only exists inside the `@supports` block, so it's
strictly additive for browsers that can actually drive it.

**Rules out:** designing any scroll-enhanced component "sticky-first" with the
plain-CSS case as an afterthought. The reachable, keyboard-operable version has to be
the default the markup produces with zero CSS support, and the animation-timeline
version has to earn its way in as a `@supports`-gated upgrade.

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
