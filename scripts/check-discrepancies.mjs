/**
 * DISCREPANCY CHECKS (PRD 13.4, 13.9)
 * --------------------------------
 * Run after `astro build` (part of `npm run verify`). Fails the build when any
 * of these are true:
 *   1. The typo "Franicsco" appears anywhere.
 *   2. A double space appears between words in source prose.
 *   3. Any anchor/src uses http:// (must be https).
 *   4. A broken email URL like aaabft.com/info@... appears.
 *   5. A <meta name="keywords"> tag exists.
 *   6. The UTF-8 replacement character (�) appears.
 *   7. Any page is missing a <title> or meta description.
 *   8. Two pages share a <title> (duplicate titles).
 *   9. A vendor credit ("powered by" / "web design by") is present.
 *  10. Legacy redirects /faqs.html -> /faq/ and /aboutus.html -> /about/ are not
 *      wired (as 301 routes in config.json, or as physical redirect files).
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const errors = [];
const warnings = [];

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

// --- Locate the built static output -----------------------------------------
const staticCandidates = ['.vercel/output/static', 'dist'];
const staticDir = staticCandidates.map((c) => resolve(root, c)).find(existsSync);
if (!staticDir) {
  console.error('[check] No build output found. Run `npm run build` first.');
  process.exit(1);
}
const htmlFiles = walk(staticDir).filter((f) => f.endsWith('.html'));
console.log(`[check] scanning ${htmlFiles.length} HTML files in ${staticDir}`);

// --- Per-file HTML checks ----------------------------------------------------
const titles = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const rel = file.replace(staticDir + '/', '');

  if (/franicsco/i.test(html)) errors.push(`${rel}: contains the "Franicsco" typo`);
  if (/href=["']http:\/\//i.test(html) || /src=["']http:\/\//i.test(html))
    errors.push(`${rel}: uses http:// link (must be https)`);
  if (/aaabft\.com\/info@/i.test(html))
    errors.push(`${rel}: broken email URL (aaabft.com/info@...)`);
  if (/<meta[^>]+name=["']keywords["']/i.test(html))
    errors.push(`${rel}: contains a meta keywords tag`);
  if (html.includes('�')) errors.push(`${rel}: contains the UTF-8 replacement character`);
  if (/powered by|web design by|designed by/i.test(html))
    errors.push(`${rel}: possible vendor credit in footer`);

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) errors.push(`${rel}: missing <title>`);
  else titles.push({ rel, title: titleMatch[1].trim() });

  const descMatch =
    html.match(/<meta\s+name=["']description["'][^>]*content=["']([\s\S]*?)["']/i) ||
    html.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i);
  if (!descMatch || !descMatch[1].trim()) errors.push(`${rel}: missing meta description`);
  else if (descMatch[1].trim().length > 160)
    warnings.push(`${rel}: meta description > 160 chars (${descMatch[1].trim().length})`);
}

// --- Duplicate titles --------------------------------------------------------
const seen = new Map();
for (const { rel, title } of titles) {
  if (seen.has(title)) errors.push(`Duplicate <title> "${title}" in ${seen.get(title)} and ${rel}`);
  else seen.set(title, rel);
}

// --- Legacy redirects --------------------------------------------------------
const configPath = resolve(root, '.vercel/output/config.json');
const want = [
  { from: '/faqs.html', to: '/faq/' },
  { from: '/aboutus.html', to: '/about/' },
];
if (existsSync(configPath)) {
  const cfg = JSON.parse(readFileSync(configPath, 'utf8'));
  const routes = cfg.routes || [];
  for (const w of want) {
    const hit = routes.find(
      (r) => r.src === w.from && String(r.status) === '301' && r.headers && r.headers.Location === w.to
    );
    if (!hit) errors.push(`Legacy redirect missing in config.json: ${w.from} -> ${w.to} (301)`);
  }
} else {
  // Fallback: physical redirect files (plain static builds).
  for (const w of want) {
    const f = resolve(staticDir, '.' + w.from);
    if (!existsSync(f)) {
      errors.push(`Legacy redirect file missing: ${w.from}`);
      continue;
    }
    const c = readFileSync(f, 'utf8');
    if (!c.includes(w.to)) errors.push(`Legacy redirect ${w.from} does not point to ${w.to}`);
  }
}

// --- Source prose: double spaces between words -------------------------------
// Scans .astro and .ts content, skipping comment lines. Catches typos like
// "San  Francisco" without tripping on code indentation.
const srcDir = resolve(root, 'src');
const srcFiles = walk(srcDir).filter((f) => /\.(astro|ts)$/.test(f));
for (const file of srcFiles) {
  const rel = file.replace(srcDir + '/', '');
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const t = line.trimStart();
    if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
    if (/(?<=\S) {2,}(?=\S)/.test(line))
      errors.push(`src/${rel}:${i + 1}: double space between words`);
  });
}

// --- Report ------------------------------------------------------------------
if (warnings.length) {
  console.log('\nWarnings:');
  warnings.forEach((w) => console.log('  - ' + w));
}
if (errors.length) {
  console.error(`\nFAILED — ${errors.length} discrepancy error(s):`);
  errors.forEach((e) => console.error('  ✗ ' + e));
  process.exit(1);
}
console.log('\nPASSED — no discrepancy errors found.');
