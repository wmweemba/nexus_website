# nexus_website

Marketing site for **Nexus Consulting Services Limited** — Lusaka, Zambia.
Astro · static output · markdown content · deployed to Coolify / Hetzner.

Replaces the WordPress/Divi site at mynexusgroup.com.

## Start here

| Document | What it is |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | Project conventions. Read before touching anything. |
| [`docs/BUILD-PLAN.md`](docs/BUILD-PLAN.md) | The phased build. Each phase is self-contained. |
| [`docs/UI_UX_SPEC.md`](docs/UI_UX_SPEC.md) | Colour, type, spacing, motion, components. |
| [`docs/PERFORMANCE-BUDGET.md`](docs/PERFORMANCE-BUDGET.md) | The constraint the whole project is built around. |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Why things are the way they are. |

Business context (positioning, brand, team) lives in the second brain at
`wsm-second-brain/ventures/nexus/`. Run `/brain context nexus` to pull it in.

## The one-line version

**Zambian mobile first.** 100 KB critical path, no third-party JavaScript, no animation
library, every graphic SVG or CSS. Premium comes from craft, not from payload.

## Develop

```bash
npm install
npm run dev
npm run build && du -sh dist
```
