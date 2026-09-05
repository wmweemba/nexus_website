# SEO audit — pre-launch keyword research and content-gap analysis

Run 2026-09-05, `p1-seo-audit`. The current `mynexusgroup.com` (WordPress/Divi) is being
replaced outright and carries no content worth preserving (see `DECISIONS.md`, "Old URLs
are a free hand") — so this is not an audit of an existing site's on-page issues. It is
keyword and content-gap research to decide the **new** site's information architecture
before any page is built, per the build plan's ordering.

No SEO tool (Ahrefs/Semrush) is connected in this session — research is web-search based.
Re-run with a connected tool before `p6-visibility` to get real volume/difficulty numbers.

## Executive summary

Zambian web-design search is crowded but generic — a dozen-plus Lusaka agencies (speMEDIA,
WebZ, 360nx, CairoAI, Optimus Media, Artyzine, WebSEO) compete on price and none anchor to
compliance or a named regulator. **Nobody in this market owns "regulator-facing IT."** That
is the opening the positioning already identified, and it is confirmed, not just asserted.

The single highest-leverage fact found this session: the **Bank of Zambia's Cyber and
Information Risk Management Guidelines were gazetted 31 May 2023** — a real, citable,
dated regulatory document that supervised institutions are already required to comply
with. Referencing it by name is the difference between "we do security awareness" and "we
close the specific finding your examiner is trained to look for." This should anchor the
security-awareness page's copy and its metadata.

**Top 3 priorities:**
1. A dedicated, keyword-targeted landing page for security awareness / phishing simulation
   — this is the wedge and the page with the clearest commercial search intent.
2. Information architecture that separates the two buyer journeys (regulated-sector
   compliance buyer vs. general SME web-design shopper) rather than forcing one page to
   serve both.
3. Schema.org `Organization` + `LocalBusiness` + `Service` markup from day one — none of
   the competitor sites surfaced in search use rich results, so this is a clean edge, not
   a catch-up move.

**Overall assessment:** clean slate, strong positioning, no technical debt to fix — the
opportunity is entirely in build order and IA, which is what this phase decides.

## Keyword opportunities

| Keyword / phrase | Difficulty | Opportunity | Intent | Recommended page |
|---|---|---|---|---|
| web design Lusaka | High (crowded) | Medium | Commercial | `/services/` (secondary target only — do not lead with this) |
| website design Zambia | High | Medium | Commercial | `/services/` |
| affordable website design Zambia | Medium | Medium | Transactional | `/services/` — the price-list angle |
| cyber security awareness training Zambia | Low–Medium | High | Commercial | `/services/security-awareness/` |
| phishing simulation Zambia | Low | High | Transactional | `/services/security-awareness/` |
| Bank of Zambia cyber risk guidelines | Low | High | Informational→Commercial | `/services/security-awareness/` (cited directly) |
| BoZ cyber and information risk management guidelines | Low | High | Informational | `/services/security-awareness/` |
| security awareness training for microfinance institutions | Low | High | Commercial | `/services/security-awareness/` |
| KnowBe4 alternative Zambia / Africa | Low | High | Commercial (comparison) | `/services/security-awareness/` — one paragraph, no direct competitor bashing |
| IT audit finding remediation Zambia | Low | Medium | Commercial | `/services/security-awareness/` |
| Microsoft 365 tenant hardening Zambia | Low | Medium | Commercial | `/services/` |
| MFA setup for business Zambia | Low | Low–Medium | Informational | fold into services copy, not a standalone page |
| firewall hardening Lusaka | Low | Medium | Commercial | `/services/` |
| site-to-site VPN Zambia branches | Low | Medium | Commercial | `/services/` |
| loan management system Zambia | Low | Medium | Commercial | `/work/ndalamahub/` |
| microfinance software Zambia | Low–Medium | Medium | Commercial | `/work/` index |
| credit risk dashboard Zambia | Low | Low–Medium | Commercial | `/work/` (folded into a case study, not standalone) |
| web hosting Zambia annual | Medium | Medium | Transactional | `/services/` (hosting section) |
| business email hosting Zambia | Medium | Medium | Transactional | `/services/` |
| domain registration Zambia | High (registrars own this) | Low | Transactional | not worth a dedicated page |
| ICT procurement Lusaka | Low | Low | Commercial | fold into services copy |
| IT consulting company Lusaka | High | Medium | Navigational/Commercial | `/` (home) and `/about/` |
| Zambia data protection act compliance IT | Low | Medium | Informational | good future blog topic — not Phase 1 |
| cyber security consultant Lusaka | Low–Medium | Medium | Commercial | `/about/` + `/services/security-awareness/` |
| website that loads fast on 3G Zambia | Low | Low (small volume, high fit) | — | not a keyword page — but the *performance budget itself* is content-marketing proof, worth one line on `/services/` |

15+ opportunities identified; the security-awareness cluster is materially less contested
than the general web-design cluster and matches the wedge strategy already locked in the
second brain — this research **confirms** the existing positioning call rather than
changing it.

## Content gaps vs. competitors

| Gap | Why it matters | Format | Priority | Effort |
|---|---|---|---|---|
| No competitor names or cites the BoZ guidelines by name | Every visible Lusaka IT/web competitor writes generically ("cyber security services") with no regulatory citation — a named, dated guideline is an unclaimed trust signal | One cited paragraph on the security-awareness page | High | Quick win |
| No competitor publishes a named case study with real numbers/scope | Competitor sites are portfolio-thin (logo walls, no narrative) | Case study template + 2 real studies (already planned, `p5-casestudy`) | High | Moderate (Phase 5, not this phase) |
| No competitor explains *how they quote* | Buyers evaluating a first vendor relationship want to know the commercial shape before calling | "How we work" section adapted from company-profile p.6 | High | Quick win — copy exists already |
| No competitor has a dedicated compliance/regulated-buyer entry point | Every agency's homepage looks the same undifferentiated "we build websites" pitch | The `/services/security-awareness/` landing page itself | High | Moderate |
| No competitor content ties price transparency to trust (a stated deposit/billing model without hourly billing) | Local buyers are wary of scope creep on web projects | "How we bill" microcopy on `/services/` and `/contact/` | Medium | Quick win |

## Technical SEO checklist (forward-looking — nothing exists yet to fail)

| Check | Status | Details |
|---|---|---|
| HTTPS | Pending | Coolify/Hetzner deploy, Phase 8 |
| Sitemap.xml | Pending | `@astrojs/sitemap`, Phase 6 |
| robots.txt | Pending | Phase 6, must not block AI crawlers per positioning on AI-search visibility |
| llms.txt | Pending | Phase 6 — genuinely differentiating, no competitor site has one |
| Structured data | Pending | Organization/LocalBusiness/Service/BreadcrumbList, Phase 6, real PACRA number available now |
| Canonical URLs | Pending | Static site, one canonical per route — trivial once routes exist |
| Mobile-friendliness | On track | Budget and mobile-first constraint already locked (`CLAUDE.md`, `PERFORMANCE-BUDGET.md`) |
| Core Web Vitals | On track | Measured in `p4-measure` and `p7-perf` |

## Prioritized action plan

**Quick wins (this phase, no code):**
- Lock the IA below, including the dedicated security-awareness route.
- Draft page copy citing the BoZ 31 May 2023 guidelines by name on the security-awareness
  page.
- Carry the "how we quote / how we bill" section from the company profile into the
  services and contact copy verbatim in spirit — it is a differentiator, not filler.

**Strategic investments (later phases, tracked so they aren't dropped):**
- `/services/security-awareness/` as its own indexable route with its own title tag and
  meta description targeting the low-competition compliance keyword cluster (Phase 4/5
  build; Phase 6 metadata).
- Schema.org markup naming the BoZ guidelines and the PACRA/TPIN numbers (Phase 6).
- A future blog/insights section covering Zambia Data Protection Act compliance — real
  keyword demand, no competitor coverage — explicitly **out of scope for this launch**,
  logged here so a later session doesn't have to rediscover it.

## Sources

- [Web Design Zambia (speMEDIA)](https://www.spemedia.co.zm/)
- [WebZ — Website Designers Lusaka](https://webz.co.zm/customised-web-design-website-designers-lusaka/)
- [360nx Designs](https://www.360nxdesigns.com/)
- [CairoAI](https://cairoai.africa/)
- [Optimus Media](https://optimusmedia.co.zm/services/web-design-development/)
- [WebSEO Zambia](https://webseo.company/local-offices/lusaka-zambia/)
- [Artyzine Webtech](https://artyzine.com/en/services/web-designing-in-zambia/)
- [Rankings — topseos.com](https://www.topseos.com/zm/best-web-design-companies-in-lusaka-zambia)
- [Bank of Zambia — Cyber and Information Risk Management Guidelines, gazetted 31 May 2023](https://www.boz.zm/BankofZambiaCyberandInformationRiskManagementGuidelinesGazetted31May2023.pdf)
- [Bank of Zambia — Banking Laws and Regulations](https://www.boz.zm/laws-and-regulation.htm)
- [Building Cybersecurity Capacities in Zambia's Business Sector: Guideline for SMEs](https://papers.academic-conferences.org/index.php/iccws/article/view/2051)
