# Work — `/work/`

Case-study index. Light ground. Full detail pages live at `/work/[slug]/` and are
Astro content-collection entries — see `p1-schema` / `src/content.config.ts`.

## Header

Eyebrow: `SELECTED WORK`
H1: `What we have actually built`
Sub: `A representative sample rather than a full list. References available on request.`

## Case cards

- **Security awareness programme** — *Built in-house, BoZ-supervised institution.* Our
  managing consultant designed, deployed and ran a phishing-simulation and awareness
  programme on open-source foundations, integrated with the institution's directory and
  mail platform. It closed the regulatory finding it was commissioned for. **Not a linked
  case-study page** — unnamed per client sensitivity, see `security-awareness.md`.
- **NdalamaHub** — *Lending management system.* A full loan management platform for a
  collateral-backed lender — borrower intake from the public website, application review
  queue, disbursement controls, a rollover engine and a collateral register. Live in
  production and processing real applications. Links to `/work/ndalamahub/`.
- **ManifiPay** — *Website & intake integration.* Public website for a Lusaka lender,
  wired directly into their loan system so an online enquiry becomes a reviewable
  application without anyone re-typing it. **Second case-study candidate — blocked on
  `p5-consent`.**
- **Credit-risk dashboard** — *Portfolio & NPL reporting.* A portfolio-quality and
  non-performing-loan dashboard built for a lender's book, turning a monthly spreadsheet
  exercise into a live view. Folded into the NdalamaHub case study rather than standalone
  (per SEO audit — insufficient distinct search volume to justify its own page).
- **Business websites & hosting** — *Ongoing retainers.* Around ten organisations across
  food production, professional services and consulting are hosted and maintained on
  annual retainers, several since 2019. Summary card only, no dedicated page.

Sectors strip: `Microfinance & lending` · `Professional services` · `Food production & retail` · `NGOs & associations`

CTA: `Start with the scoping call` → `/contact/`

---

**Consent blocker:** `p5-casestudy` needs a second named case study beyond NdalamaHub.
ManifiPay is the natural candidate — confirm with the client before building
`/work/manifipay/`. Until confirmed, the index shows NdalamaHub only as a linked case
study.
