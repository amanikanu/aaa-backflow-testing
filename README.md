# AAA Backflow Testing — website

Fast, mobile-first marketing & booking site for **AAA Backflow Testing LLC**
(San Francisco, CA). Built from the PRD v1 (Nov 17, 2026).

- **Stack:** Astro (hybrid output) + TypeScript + Tailwind CSS. Zero UI framework,
  almost no client JavaScript, no third-party scripts on first load.
- **Design system ("Flow & Trust"):** bespoke tokens in `src/styles/global.css`
  (deep navy → water teal → valve-amber accent), a self-hosted display face
  (Space Grotesk via `@fontsource`), a custom logo mark, a hand-drawn hero
  illustration, and wave section dividers — no stock imagery.
- **Scheduler:** FullSlate, opened over **https**, embedded only on click.
- **Contact form:** serverless function (`/api/contact`) with validation, honeypot,
  rate limiting, and email via Resend.
- **SEO/a11y:** unique titles & descriptions, JSON-LD (LocalBusiness, Service,
  FAQPage, BreadcrumbList), sitemap, 301 legacy redirects, WCAG 2.2 AA markup.

## Routes

`/` · `/backflow-testing/` · `/backflow-repair/` · `/new-installations/` ·
`/compliance-reporting/` · `/pricing/` · `/faq/` · `/service-area/` · `/about/` ·
`/book/` · `/contact/` · `/privacy/` · `/accessibility/` · `404` ·
legacy redirects `/faqs.html → /faq/`, `/aboutus.html → /about/`.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Local dev server (http://localhost:4321) |
| `npm run build` | `generate-sitemap` + `astro build` → `.vercel/output` |
| `npm run check` | `astro check` (0 errors/warnings/hints in CI) |
| `npm test` | Vitest unit tests (business data, contact validation, SEO, FAQ, redirects) |
| `npm run lint:discrepancies` | Build-gate checks (typo, http links, meta keywords, dup titles, redirects…) |
| `npm run verify` | `build` + `lint:discrepancies` + `test` — run before deploy |

## Single source of truth

All business facts live in **`src/content/business.ts`** (`business` + `config` flags).
Pages, components, and JSON-LD all read from it. Do not hard-code facts elsewhere.

Unverified items are hidden behind `config` flags (default `false`) or omitted. See
**`HANDOFF.md`** for the full list of what must be confirmed before launch, and
**`EDITING_GUIDE.md`** for how the owner updates price, hours, FAQ, and flags.

## Environment (`.env.example`)

```
OFFICE_EMAIL=info@aaabft.com
RESEND_API_KEY=
EMAIL_FROM="AAA Backflow Testing <noreply@aaabft.com>"
PUBLIC_GA4_ID=            # optional; loads only after consent
```

Without `RESEND_API_KEY` the contact function logs a no-op and still returns success.

## Deploy

Configured for **Vercel** (adapter `@astrojs/vercel/serverless`). `vercel deploy` after
`npm run build`. For Netlify/Cloudflare, swap the adapter in `astro.config.mjs`
(`@astrojs/netlify` / `@astrojs/cloudflare`) and rebuild.

## Quality gates (PRD 13.9)

- `npm run verify` green (build + discrepancy checks + unit tests).
- `astro check` clean.
- Lighthouse 90+ target (Performance/Accessibility/Best Practices/SEO) on home, a
  service page, FAQ, and contact — verify on the deployed preview.
- Optional end-to-end smoke test in `tests/e2e/` (Playwright) — install browsers with
  `npx playwright install` then `npx playwright test`. Not part of `npm test`.
