/**
 * BUSINESS DATA — SINGLE SOURCE OF TRUTH (PRD 13.3)
 * -------------------------------------------------
 * Every page, component, and JSON-LD block reads from this file.
 * Do NOT hard-code business facts anywhere else. Update here, then rebuild.
 *
 * GUARDRAILS (13.10): Nothing here is invented. Every value comes from the
 * PRD's verified content. Items that the client has NOT confirmed are kept
 * behind a config flag (default false) or marked `TODO`, and are listed in
 * HANDOFF.md. If you change a flag to true, you are asserting the client
 * confirmed it — record that sign-off in HANDOFF.md.
 */

export const business = {
  name: 'AAA Backflow Testing LLC',
  legalName: 'AAA Backflow Testing LLC',
  // Brand name used in page titles and OG tags (the PRD title examples drop "LLC").
  shortName: 'AAA Backflow Testing',
  // Phone is SHOWN (header/hero/footer/contact) per discrepancy fix #3, but is
  // flagged UNVERIFIED in HANDOFF.md — the lead sheet reports a conflict that
  // must be resolved with the client before launch.
  phone: '415-535-1332',
  phoneHref: 'tel:+14155351332',
  email: 'info@aaabft.com',
  // Scheduling: PRD requires https. FullSlate https support must be confirmed
  // by the client; if it does not resolve, keep the http link, flag it, and ask
  // the client to enable https in FullSlate (see HANDOFF.md).
  schedulingUrl: 'https://aaabackflowtesting.fullslate.com/',
  city: 'San Francisco',
  region: 'CA',
  // Service area: City and County of San Francisco is confirmed on the current
  // site. Marin County appears only on the About page — show only after client
  // confirmation via the marinEnabled flag (default false).
  serviceAreaPrimary: 'City and County of San Francisco',
  serviceAreaMarin: 'Marin County',
  // Hours: 8 a.m.–5 p.m. per the current About page; days of the week are
  // UNCONFIRMED. Store as TODO; show "business hours 8 a.m.–5 p.m." without
  // days. After-hours available by arrangement (possible small fee).
  hoursText: 'Business hours 8 a.m.–5 p.m.',
  afterHoursNote:
    'After-hours and flexible appointments are available by arrangement; a small service fee may apply.',
  // Address is NOT published on the current site. Leave blank; use service-area
  // schema only. showAddress flag stays false unless the client opts in.
  address: '',
  foundedYear: null as number | null, // not supplied; never invent.
  ownerName: null as string | null, // not confirmed; do not publish until approved.
  sameAs: [] as string[], // confirmed social/profiles only — none supplied yet.

  services: [
    {
      slug: 'backflow-testing',
      title: 'Backflow Testing',
      summary:
        'Annual certified backflow testing for residential and commercial devices.',
    },
    {
      slug: 'backflow-repair',
      title: 'Backflow Repair',
      summary:
        'Repair of failed devices, replacement parts, and required rechecks.',
    },
    {
      slug: 'new-installations',
      title: 'New Installations & Consulting',
      summary:
        'Consulting for architects and contractors on new device installations.',
    },
    {
      slug: 'compliance-reporting',
      title: 'Compliance Reporting',
      summary:
        'Paperwork for the city, DPH and PUC; test reports retained for 3 years.',
    },
  ] as const,

  // Price (13.3): $160 per device per annual test, including DPH tags and
  // paperwork for the PUC and DPH; the testing fee is due whether the device
  // passes or fails. FLAGGED: undated in the source — confirm current before
  // shipping (PRD open question #3, discrepancy #15).
  price: {
    amountPerDevice: 160,
    currency: 'USD',
    includes: 'DPH tags and paperwork for the PUC and DPH',
    failedFeeNote:
      'The testing fee is due whether the device passes or fails.',
    multipleDeviceNote: null as string | null, // commercial/multi-device rates unconfirmed.
  },

  credentials: {
    licensedSF: true, // licensed in City and County of San Francisco (About page)
    licensedMarin: true, // per About page — gated by marinEnabled
    awwaCertified: true, // testers hold AWWA certification (About page)
    awwaContinuingEducation: true, // updated annually through continuing education
    licenceNumber: null as string | null, // not published yet
    awwaNumber: null as string | null, // not published yet
  },

  // Reviews (13.3): 40 reviews on Yelp per the lead sheet. Store the COUNT only;
  // do NOT claim a star rating that is not sourced. Gate behind showReviews.
  reviews: {
    source: 'Yelp',
    count: 40,
    ratingValue: null as number | null,
    url: 'https://www.yelp.com/biz/aaa-backflow-testing-san-francisco',
    testimonials: [] as { quote: string; author: string }[],
  },

  // Official source for regulatory claims (discrepancy #14). Link every
  // regulatory statement to this so visitors can verify it. TODO until the
  // exact SFPUC/DPH URL is confirmed by the client.
  regulatorySource: {
    label: 'San Francisco Public Utilities Commission — Backflow Prevention',
    url: 'https://sfwater.org/', // TODO: replace with the exact SFPUC/DPH backflow program page
  },
} as const;

/**
 * CONFIG FLAGS (13.3). Every flag defaults to false. Set true ONLY after the
 * client confirms the corresponding fact, and record the sign-off in HANDOFF.md.
 */
export const config = {
  marinEnabled: false, // Show Marin County in the service area?
  showAddress: false, // Publish a street address (service-area business by default)?
  showPrice: false, // Show $160 price headline (after client confirmation)?
  showReviews: false, // Show the Yelp review count/testimonials?
  showHoursDays: false, // Show days of week (only once confirmed)?
} as const;

/** Effective service-area statement built from the flags (discrepancy #11). */
export function serviceAreaStatement(): string {
  const areas: string[] = [business.serviceAreaPrimary];
  if (config.marinEnabled) areas.push(business.serviceAreaMarin);
  return areas.join(' and ');
}

export type Business = typeof business;
export type Config = typeof config;
