/**
 * Generates public/sitemap.xml from the known route list. Done manually instead
 * of via @astrojs/sitemap to avoid an incompatibility with the serverless
 * adapter build step. Run before `astro build` (see package.json "build").
 *
 * Update ROUTES if you add/remove pages. Keep SITE_URL in sync with astro.config.site.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://www.aaabft.com';
const LASTMOD = '2026-11-17';

// Canonical routes (exclude the 404). Order is irrelevant.
const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/backflow-testing/', priority: '0.9', changefreq: 'monthly' },
  { path: '/backflow-repair/', priority: '0.8', changefreq: 'monthly' },
  { path: '/new-installations/', priority: '0.8', changefreq: 'monthly' },
  { path: '/compliance-reporting/', priority: '0.8', changefreq: 'monthly' },
  { path: '/pricing/', priority: '0.8', changefreq: 'monthly' },
  { path: '/faq/', priority: '0.8', changefreq: 'monthly' },
  { path: '/service-area/', priority: '0.8', changefreq: 'monthly' },
  { path: '/about/', priority: '0.7', changefreq: 'monthly' },
  { path: '/book/', priority: '0.9', changefreq: 'monthly' },
  { path: '/contact/', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy/', priority: '0.3', changefreq: 'yearly' },
  { path: '/accessibility/', priority: '0.3', changefreq: 'yearly' },
];

const url = (p) => `${SITE_URL}${p}`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...ROUTES.map(
    (r) =>
      `  <url><loc>${esc(url(r.path))}</loc><lastmod>${LASTMOD}</lastmod>` +
      `<changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
  ),
  '</urlset>',
  '',
].join('\n');

const outDir = join(__dirname, '..', 'public');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'sitemap.xml'), xml, 'utf8');
console.log(`[sitemap] wrote ${ROUTES.length} URLs to public/sitemap.xml`);
