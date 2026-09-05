# Contact — `/contact/`

**No-JS requirement (`p5-contact`, `CLAUDE.md` rule 1):** the form must work without
JavaScript. A static Astro site has no server to receive a POST, so the form action points
at a form backend (e.g. Formspree/a mailto) or the page simply leads with the mailto path
as primary and treats a hosted form endpoint as enhancement. **Decide the specific
mechanism in Phase 5 build** — this file specifies the copy and fields only.

## Header — dark

Eyebrow: `GET IN TOUCH`
H1: `Start with the scoping call.`

Body:
> If you are carrying a finding, renewing a website, or simply unsure whether your current
> setup would survive being looked at closely — that first conversation costs you nothing
> and usually tells you what you need to know.

## Contact block — light

Team (three names, per company profile, individual emails kept since these already
appear publicly on stationery — the profile's "one switchboard number" restraint applies
to phone, not email):

| Name | Title | Email |
|---|---|---|
| William S. Mweemba | Managing Consultant | william@mynexusgroup.com |
| Elias Mulenga | Chief Technology Officer | elias@mynexusgroup.com |
| Farai Liwewe | Director | farai@mynexusgroup.com |

General:
- **Telephone:** +260 954 156 056
- **Email:** info@mynexusgroup.com
- **Office:** Plot 9 Katopola Road, Rhodes Park, Lusaka
- **Web:** mynexusgroup.com

## Form fields (minimal — this is a scoping-call gate, not a full brief intake)

- Name (required)
- Organisation
- Email (required)
- What are you trying to fix? (textarea, required) — deliberately open rather than a
  dropdown of services, since the audit found buyers often don't yet know which of the
  six service lines they need.
- Submit label: `Request a scoping call`

Fallback line beneath the form: `Prefer email? Write to info@mynexusgroup.com directly.`
