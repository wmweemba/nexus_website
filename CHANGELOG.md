# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Nothing yet — Phase 1 (content and SEO architecture) starts here.

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
