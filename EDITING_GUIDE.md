# Editing guide — AAA Backflow Testing site

Everything you might need to change lives in two files. No build tools required to
*edit* content; you do need to run `npm run build` (or let your host build) to publish.

## 1. The two files that matter

| What you want to change | File | What to edit |
|--------------------------|------|--------------|
| Phone, email, scheduling URL, service area, hours text, business name | `src/content/business.ts` | Edit the `business` object |
| Price, credentials, reviews, flags | `src/content/business.ts` | Edit `business` and `config` |
| FAQ questions & answers | `src/content/faq.ts` | Edit the `faqs` array |
| Service-page copy (Testing/Repair/Installations/Compliance) | `src/content/services.ts` | Edit `servicePages` |
| Nav, footer, page text | the `.astro` file in `src/pages/` | Edit the page directly |

---

## 2. Turn a feature on once it's confirmed (the `config` flags)

Open `src/content/business.ts`, find the `config` block near the bottom. Change `false`
to `true` for the item you've confirmed with the client:

```ts
export const config = {
  marinEnabled: false,   // → true when Marin County is a confirmed service area
  showAddress: false,    // → true to publish a street address
  showPrice: false,      // → true once the $160 rate is confirmed current
  showReviews: false,    // → true once Yelp/Google approval is given
  showHoursDays: false,  // → true once the days of the week are confirmed
};
```

> Each flag defaults to `false` on purpose: the site never shows an unconfirmed price,
> service area, review, or hour. When `false`, the site shows a safe placeholder
> ("contact us for current pricing", "business hours 8 a.m.–5 p.m.").

---

## 3. Update the price

1. In `business.ts`, confirm `price.amountPerDevice` and `price.includes` are correct.
2. Set `config.showPrice = true`.
3. Rebuild. The price then appears on the home, pricing, FAQ, and service pages.

---

## 4. Update the hours / days

- Hours text (no days): edit `business.hoursText` (e.g. `"Business hours 8 a.m.–5 p.m."`).
- After-hours note: edit `business.afterHoursNote`.
- To show specific days in the search-engine data, confirm the days, set
  `config.showHoursDays = true`, and fill `openingHoursSpecification` in
  `src/lib/schema.ts` (it is pre-structured; just uncomment/adjust the days & times).

---

## 5. Edit an FAQ

In `src/content/faq.ts`, each item looks like:

```ts
{
  id: 'cost',
  question: 'How much does a backflow test cost?',
  paragraphs: ['We charge a flat rate per device for the annual test. …'],
  // priceLine is shown ONLY when config.showPrice is true:
  priceLine: 'Our current rate is $160 per device for the annual test, …',
  source: { label: 'SFPUC Backflow Prevention', url: 'https://…' }, // for regulatory claims
}
```

- Add a question: copy an existing block, give it a unique `id`, fill `question`/`paragraphs`.
- Link a regulatory claim to the official source via `source` (keeps the claim verifiable).
- Do **not** add a star rating or invent numbers — link to the city instead.

---

## 6. Publish

```bash
npm install        # first time only
npm run build      # builds the site
npm run verify     # build + discrepancy checks + tests (run before deploy)
npm run dev        # preview locally at http://localhost:4321
```

Deploy the `build` output to Vercel (already configured). For Netlify/Cloudflare, swap
the adapter in `astro.config.mjs` (see HANDOFF.md §5).

---

## 7. Quick "is it safe to ship?" checklist

- [ ] Phone number confirmed with the client (resolve the Yelp conflict).
- [ ] `showPrice` = true **only if** $160 is confirmed current.
- [ ] `marinEnabled` = true **only if** Marin is a confirmed service area.
- [ ] `regulatorySource.url` points to the exact SFPUC/DPH backflow page.
- [ ] FullSlate https URL confirmed resolvable.
- [ ] `RESEND_API_KEY` set so contact emails actually send.
- [ ] `npm run verify` passes with 0 errors.
