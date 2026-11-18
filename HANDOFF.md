# HANDOFF.md — AAA Backflow Testing website rebuild

**Status:** Built and passing automated gates (build, discrepancy checks, unit tests,
`astro check`). **Not yet launch-ready** until the client confirms the items below.
This file is the single list of everything that is unverified or TODO. Nothing here
is shown on the public site (per the PRD's definition of done #6) — unresolved facts
are either hidden behind a config flag (default `false`) or simply omitted.

---

## 1. Config flags (single source of truth: `src/content/business.ts`)

All flags default to `false`. Flip a flag to `true` ONLY after the client confirms the
corresponding fact, and record the sign-off here next to the flag.

| Flag | Current | What it gates | Enable when client confirms… |
|------|---------|---------------|------------------------------|
| `marinEnabled` | **false** | Shows "Marin County" in the service area (hero, footer, schema, /service-area/) | Marin is a verified service area |
| `showAddress` | **false** | Publishes a street address | They want a public address (default: service-area business) |
| `showPrice` | **false** | Shows "$160 per device" on home, pricing page, FAQ, service pages | The $160 rate is **current** (open question #3) |
| `showReviews` | **false** | Shows the Yelp review count / testimonials | Yelp (and/or Google) permission + approved quotes (open question #10) |
| `showHoursDays` | **false** | Adds `openingHours` to LocalBusiness schema | The days of the week are confirmed |

---

## 2. Unverified facts that MUST be confirmed before launch

- **Business status & phone (PRD open question #1).** The site shows
  `415-535-1332` (from the existing site meta), but the lead sheet reports a
  **conflict with another source (e.g. Yelp)**. Resolve with a phone call before launch.
  The number is shown as a `tel:` link everywhere but is flagged here as unverified.
- **Operating status.** Confirm the business is active before investing further.
- **Current price (open question #3).** $160/device is from the old FAQ but undated.
  Confirm it is current before setting `showPrice = true`. Also ask about
  multi-device / commercial rates (stored as `price.multipleDeviceNote = null`).
- **Days & hours + after-hours fee (open question #4).** Site says "8 a.m.–5 p.m."
  with no days stated. `hoursText` shows "Business hours 8 a.m.–5 p.m." without days.
  Get the days; then set `showHoursDays = true` and fill `openingHoursSpecification`.
  The after-hours note is shown as written.
- **Service area (open question #5).** SF is confirmed. Marin appears only on the old
  About page — confirm before `marinEnabled = true`. Ask about any other counties/cities.
- **Licence & certification numbers (open question #7).** We state "licensed in SF"
  and "AWWA-certified testers" (from the About page) but publish **no** licence or
  AWWA numbers (`licenceNumber` / `awwaNumber` are `null`). Supply them if the client
  wants them published.
- **FullSlate (open question #8).** Booking opens `https://aaabackflowtesting.fullslate.com/`.
  Confirm (a) the https URL resolves, and (b) the FullSlate plan/account. If https does
  not resolve, keep the http link, flag it, and ask the client to enable https in FullSlate.
- **Domain / hosting / email access (open question #2).** Unknown who controls the
  domain, hosting, DNS, and email. Needed to cut over and to verify `OFFICE_EMAIL`.
- **Reviews (open question #10).** Lead sheet says "40 reviews on Yelp" — we store the
  **count** only, never a star rating (guardrail). Turn on `showReviews` only with client
  approval and approved quotes. The Yelp source URL is a best guess and should be verified.
- **Owner / technician identity & photos (open question #9).** No owner name is published
  (`ownerName = null`); no photos are used. Supply a bio/photo only if approved. Do **not**
  use the personal name that appears in the old site's hidden meta keywords.
- **Regulatory source link (discrepancy #14).** `business.regulatorySource.url` is a
  **TODO placeholder** (`https://sfwater.org/`). Replace with the exact SFPUC/DPH backflow
  program page. Every regulatory claim on the site links to it; no statutory numbers
  (1984 / 26,000 devices / Article 12A / Title 17) are asserted on the public site.
- **Logo.** The old header is a GIF. Request a vector/high-res file. Until then the site
  uses a clean SVG mark (`public/favicon.svg`) + wordmark.
- **Analytics.** `PUBLIC_GA4_ID` is blank; GA4 loads only after consent. Supply the ID to
  enable (see `.env.example`).

---

## 3. Discrepancy matrix — how each item is fixed & verified

| # | Issue | Fix | Verification |
|---|-------|-----|--------------|
| 1 | Title typo "Franicsco" | Title built from one helper; typo never present | `check-discrepancies` fails on `/franicsco/i` |
| 2 | Homepage no readable content | Full homepage structure (H1 + 9 sections) | Homepage has H1, phone as real text, 9 sections |
| 3 | Phone only in meta | `tel:` link in header, hero, footer, contact | Present in every page's header/footer |
| 4 | Scheduling over http + raw URL | Button → `/book/` → https FullSlate; no raw URL | `check-discrepancies` fails on `http://` links |
| 5 | Scheduling image no alt | Real `<a>` button with visible text | No image-only links; axe passes |
| 6 | Identical titles/meta | Unique title + description per page | `check-discrepancies` fails on duplicate titles |
| 7 | Meta keywords w/ dup + name | No meta keywords tag emitted | `check-discrepancies` fails if present |
| 8 | Broken FAQ email link | All email links are `mailto:` from `business.ts` | `check-discrepancies` fails on `aaabft.com/info@` |
| 9 | Broken apostrophe encoding | UTF-8 declared; real apostrophes; CI check | `check-discrepancies` fails on replacement char |
| 10 | Image-button nav + tables | Real text nav, CSS grid, no tables | Keyboard nav works; renders at 320px |
| 11 | Service-area inconsistency | One statement from `business.ts`, Marin via flag | Same statement in meta/hero/footer/schema |
| 12 | Hours only on About, no days | `hoursText` on contact + footer | Hours in footer + contact page |
| 13 | No privacy/copyright/a11y | Three pages + footer copyright w/ year | Footer + policy pages linked on every page |
| 14 | Unverified regulatory claims | Each links to official source (TODO until verified) | No unsourced numeric legal claim shown |
| 15 | Price buried & undated | Pricing page + home callout, gated by `showPrice` | Price shown only when flag is true |
| 16 | Vendor credit in footer | Removed | `check-discrepancies` fails on "powered by"/"web design by" |

Automated gate: `npm run verify` → `astro build` → `check-discrepancies` → `vitest`.
`astro check` reports 0 errors / 0 warnings / 0 hints.

---

## 4. Contact form (serverless)

- Endpoint: `src/pages/api/contact.ts` (hybrid → Vercel serverless function).
  Shared logic in `src/lib/contact.ts` (validation, honeypot, in-memory rate limit, email).
- Email sending uses **Resend** via `RESEND_API_KEY` + `EMAIL_FROM` env vars; office
  address from `OFFICE_EMAIL`. If the key is absent, the function logs a no-op (dev) and
  still returns success to the user — wire the key before relying on delivery.
- **Test before launch:** submit the form and confirm (a) an office email arrives, and
  (b) the sender receives the confirmation. The confirmation states only what the client
  approved (no response-time promise).

---

## 5. Deployment

- Primary target: **Netlify** (Astro 4-compatible `@astrojs/netlify` adapter configured).
  Netlify runs `npm run build`, publishes `dist`, and deploys the contact API route.
  Node.js 22.23.3 is pinned in `.nvmrc` for reproducible installs and builds.
- To deploy on **Cloudflare Pages**, swap to its Astro-compatible adapter in
  `astro.config.mjs` and rebuild.
- Set env vars on the host (see `.env.example`): `OFFICE_EMAIL`, `RESEND_API_KEY`,
  `EMAIL_FROM`, optional `PUBLIC_GA4_ID`, optional `PUBLIC_SITE_URL`.
- After launch: verify in Search Console, monitor FullSlate bookings and call logs for
  two weeks (PRD §12 Phase 4).

---

## 6. Known limitations / out of scope (v1)

- No online payment, no customer accounts, no test-report portal (per PRD non-goals).
- FullSlate is kept as the scheduler (better integrated, https-only, click-to-load embed).
- No analytics script loads before consent; no chat widget, pop-up, or tracking overlay.
- Accessibility is handled with semantic markup, not an overlay widget.
