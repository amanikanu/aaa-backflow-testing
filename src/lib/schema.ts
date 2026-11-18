/**
 * JSON-LD SCHEMA BUILDERS (PRD 7.3 F16, 13.8)
 * ---------------------------------------------
 * All structured data is built from business.ts so it stays in sync with the
 * single source of truth. aggregateRating is omitted unless reviews are visible
 * and sourced (guardrail 13.10). Regulatory specifics are intentionally NOT
 * asserted here; link to the official source instead.
 */

import { business, config, serviceAreaStatement } from '../content/business';
import { publishedFaqs } from '../content/faq';

export type Json = Record<string, unknown>;

export function localBusinessSchema(): Json {
  const base: Json = {
    '@context': 'https://schema.org',
    '@type': 'Plumber', // closest schema.org type for a backflow testing business
    name: business.name,
    telephone: business.phone,
    email: business.email,
    url: 'https://www.aaabft.com',
    areaServed: serviceAreaStatement(),
    priceRange: config.showPrice ? '$$' : undefined,
    description:
      'Licensed backflow testing, repair, installation consulting, and compliance reporting in San Francisco.',
  };
  if (config.showHoursDays) {
    // Add openingHours only once days are confirmed.
    base.openingHoursSpecification = [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ];
  }
  if (business.sameAs.length) base.sameAs = business.sameAs;
  return base;
}

export function serviceSchema(name: string, description: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    provider: { '@type': 'Plumber', name: business.name },
    areaServed: serviceAreaStatement(),
    description,
  };
}

export function faqSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: publishedFaqs().map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.paragraphs.join('\n\n'),
      },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `https://www.aaabft.com${t.path}`,
    })),
  };
}

/** Serialize a schema object into a <script type="application/ld+json"> block. */
export function jsonLd(schema: Json): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
