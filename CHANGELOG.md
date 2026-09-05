# Changelog

Most recent entry is always at the top.

---

## 2026-09-05 (Phase 0 — Repo and foundations)

Astro 7.3.1 scaffolded (static output, TypeScript strict). Tailwind v4.3.3 wired via
`@tailwindcss/vite`, content scan scoped to `src/` after confirming the NS-010 dead-CSS
trap live (see `docs/DECISIONS.md`). Brand tokens from `docs/UI_UX_SPEC.md` §2 as CSS
custom properties, mapped into Tailwind's theme via `@theme inline`. Sora 600/700 and IBM
Plex Sans 400/500 self-hosted as Latin-subset WOFF2 (75.1 KB total, budget 80 KB); IBM
Plex Mono deferred to `p2-mono`. Build-size budget check added (`npm run budget`).
NS-008 registry row added in the second brain. `/sec --init` deferred — reserved for
explicit user invocation, could not be run from this session.

Next: Phase 1 — content and SEO architecture.
