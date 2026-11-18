/**
 * SEO HELPERS (PRD 13.8)
 * -----------------------
 * Central helpers so every page gets a unique, correct title and description,
 * a canonical URL, Open Graph tags, and JSON-LD hooks. Uniqueness is enforced
 * by the caller passing distinct strings and by scripts/check-discrepancies.mjs
 * (run in `npm run verify`), which fails the build on duplicate titles or
 * missing descriptions.
 */

import { business } from '../content/business';

export const SITE_NAME = business.shortName;
export const SITE_URL = 'https://www.aaabft.com';

export interface PageMetaInput {
  title: string; // unique per page
  description: string; // <= 160 chars of the company's own wording
  path: string; // e.g. "/pricing/"
  ogType?: 'website' | 'article';
  noIndex?: boolean;
}

/** Format a page title as "Page | AAA Backflow Testing". */
export function formatTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

export function canonicalUrl(path: string): string {
  const clean = path.endsWith('/') ? path : `${path}/`;
  return `${SITE_URL}${clean === '//' ? '/' : clean}`;
}

/**
 * Returns the full <title> and meta description for a page. The caller is
 * responsible for keeping `title` and `description` unique across the site.
 */
export function pageMeta(input: PageMetaInput) {
  return {
    title: input.title,
    description: input.description,
    canonical: canonicalUrl(input.path),
    ogType: input.ogType ?? 'website',
    noIndex: input.noIndex ?? false,
  };
}
