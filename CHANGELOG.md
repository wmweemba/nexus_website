# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Phase 1 — content and SEO architecture.

### Added

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
