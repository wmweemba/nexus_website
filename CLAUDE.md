# Nexus Consulting website — project conventions

Read this before doing anything in this repo. It is the contract every Claude Code
session in this project inherits.

**Business context lives in the second brain**, not here:
`wsm-second-brain/ventures/nexus/_overview.md` (positioning, brand system, team) and
`wsm-second-brain/ventures/nexus/website-2026/00-build-plan.md` (the canonical build
plan). Run `/brain context nexus` to pull it in. Do not duplicate that content here —
link to it.

---

## What this is

A static marketing site for Nexus Consulting Services Limited, replacing a WordPress/Divi
site. Built with **Astro**, content in **markdown in this repo**, deployed as static files
to **Coolify / Hetzner**.

## The binding constraint — read this twice

**Zambian mobile first. The site must be usable on 3G and readable on 2G.**

Nexus's own price list and company profile promise clients "sites that load quickly on a
Zambian mobile connection". A slow site here disproves the company's sales copy in the
most public place available. This is not a performance target to optimise toward later;
it is a design constraint that decides what gets built.

**If a design idea cannot be built inside the budget, the idea changes — not the budget.**

Full budget and how to measure it: `docs/PERFORMANCE-BUDGET.md`.

| | Budget |
|---|---|
| Critical path (HTML + CSS + JS), compressed | ≤ 100 KB |
| First viewport total, including hero | ≤ 250 KB |
| LCP, throttled Slow 4G | < 2.5 s |
| Third-party JavaScript | zero |
| Animation libraries | none — no GSAP, Framer Motion, Lottie, Three, Lenis, AOS |

## Standing rules

1. **No JavaScript unless a feature genuinely cannot work without it.** Astro ships zero
   JS by default. Keep it that way. An island needs a written justification in
   `docs/DECISIONS.md`.
2. **Every graphic is SVG or CSS unless it is a photograph or a real product screenshot.**
   Precedent: `ndalamahub_lms_app` `client/src/components/auth/AuthLayout.jsx` builds its
   entire visual effect from inline SVG — no images, no libraries, no extra requests.
3. **Motion is CSS, never a library.** Native scroll-driven animations
   (`animation-timeline`), gated behind `@supports (animation-timeline: scroll())` with an
   IntersectionObserver fallback. Firefox still has the feature behind a flag.
4. **Never hijack the scroll.** Horizontal sections use `position: sticky` plus a
   scroll-linked `translateX`. Scroll-jacking is the thing that feels broken on low-end
   Android.
5. **`prefers-reduced-motion` is honoured on every animated element.** Not a later pass.
6. **Semantic HTML and a real heading hierarchy.** This is simultaneously the
   accessibility requirement, the SEO requirement and the AI-search requirement. They do
   not conflict.
7. **Verify by rendering, not by reading source.** A green build is not evidence that
   anything looks right. Screenshot the page.

## Known traps in this stack

**⚠ NS-010 — Tailwind v4 token shorthand.** Tailwind v4 silently dropped the v3
`bg-[--token]` shorthand. Lint passes, the build passes, and the styling is simply dead.
Use `bg-(--token)`, `bg-[var(--token)]`, or `@theme inline` utilities. Detect with:

```bash
grep -oE '\.[a-z-]+-\\\[--[a-z-]+\\\]\{[^}]*\}' dist/**/*.css | grep -v 'var('
```

Any hit lacking `var(` is dead CSS. Full writeup:
`wsm-second-brain/systems/NS-010-tailwind-v4-token-shorthand-gotcha.md`.

**Opera Mini** retains meaningful share on low-end Android in this market and renders
server-side with almost no CSS animation. The site must be readable and navigable there
with every effect absent.

**Fonts are the first place the budget bites.** Sora and IBM Plex ship at 46 KB and
183 KB per weight as raw TTF. They must be Latin-subset WOFF2, capped at three or four
weights total across the whole site. See `docs/UI_UX_SPEC.md`.

## Design system

`docs/UI_UX_SPEC.md` is authoritative for colour, type, spacing, motion and component
behaviour. The brand system it derives from is published at
https://claude.ai/code/artifact/a6f74417-7398-4dea-bca9-8e67d220fce3 — do not re-derive
tokens from that page, use the spec.

## Decisions

Every non-obvious choice gets a dated entry in `docs/DECISIONS.md`, with the reasoning.
Sessions are separate; the reasoning is the only thing that survives between them.

## Skills to use in this repo

| When | Skill |
|---|---|
| Before writing page content | `marketing:seo-audit` |
| Aesthetic direction calls | `frontend-design` |
| Implementation quality bar | `web-craft` |
| robots / sitemap / llms.txt / JSON-LD / OG | `online-visibility` |
| Performance measurement | `pa --full` |
| Accessibility | `a11y --full` |
| Regression before release | `qa --full` |
| Security | `sec` |
| Pre-deploy gate | `/ship` |
| End of session | `/brain log` |

## Security Conventions (NS-002 / NS-003)

These are standing rules, not suggestions. Violating any of these is a P0 finding in `/sec --full`.

- The app's runtime DB connection must use a least-privilege role. Never the superuser, in any environment, including local dev.
- Every .env variant must be in both .gitignore and .dockerignore before the first commit that introduces it.
- Every database query must be scoped to the authenticated user/tenant. No route queries data without an auth check immediately before it.
- No secret is ever exposed through a public-prefixed env var (NEXT_PUBLIC_*, VITE_*, etc.).
- Before any production deploy, the running framework version must be checked against published CVEs — do not assume "recently installed" means "currently safe."
- Docker images never COPY an env file or otherwise bake a secret into a layer.
- Error responses in production never include stack traces, file paths, or internal config.
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options) and disabling the framework's "powered by" header are part of the initial scaffold, not a later add-on.

> Note for this repo: it is a static site with no database and no auth. The DB and
> tenancy rules above are inherited from the standard block and are inert here — do not
> delete them (the block is copied verbatim across projects), but do not invent a database
> to satisfy them either. The headers, env, dependency and error-response rules all apply
> in full.

## Commit style

Match the second brain's style: a short imperative subject, a blank line, then why.
**Never add Co-Authored-By or any AI attribution trailer.**
