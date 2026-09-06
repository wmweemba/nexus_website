# Redirects and 410s — old WordPress site → new site

`p6-redirects`. Old-site URLs confirmed 2026-09-06 by reading the live WordPress site's
own Yoast-generated `page-sitemap.xml` and `post-sitemap.xml` at mynexusgroup.com — not
guessed. Full reasoning for treating these URLs as a free hand: `docs/DECISIONS.md`,
"Old URLs are a free hand."

**Not wired up yet.** This repo has no Dockerfile or web-server config — that's
`p8-deploy`. A static Astro build has no way to emit a non-200 HTTP status on its own;
that has to happen at the web-server layer (nginx `return 410`, a Coolify redirect rule,
or equivalent) once the actual hosting mechanism is chosen. This file is the spec for
whoever wires that up.

## Redirects — same path on both sites, no action needed

| Old URL | New URL | Note |
|---|---|---|
| `/about/` | `/about/` | Same path on the new site. No redirect rule required. |
| `/contact/` | `/contact/` | Same path on the new site. No redirect rule required. |

## 410 Gone — no replacement content

These had no live data (`/scan/`, `/ncs/`, `/3cx/`) or are off-brand blog content (two
devotional posts, one `hello-world` stub) with zero business relevance to an ICT
consultancy. Serve `410 Gone`, not a 404 or a redirect to the homepage — 410 tells search
engines the removal is deliberate and permanent, which de-indexes faster than a 404.

| Old URL |
|---|
| `/scan/` |
| `/ncs/` |
| `/3cx/` |
| `/2024/01/10/the-mustard-seed-of-faith/` |
| `/2024/01/10/faith-through-trials/` |
| `/2020/11/24/hello-world/` |

## Implementation note for `p8-deploy`

If Coolify serves this as a static site behind nginx, the 410 block is six `location`
entries returning `410;` with no body, plus the two same-path pages simply falling through
to the new build's own `/about/` and `/contact/` — nothing extra needed for those. If
Coolify's static-site offering doesn't expose raw nginx config, check whether it accepts a
`_redirects`-style file or per-path status overrides before reaching for a custom
Dockerfile.
