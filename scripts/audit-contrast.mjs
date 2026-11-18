/**
 * Contrast audit: parses the built static HTML, tracks the nearest background
 * colour via the class stack, and computes WCAG contrast for every element that
 * sets an explicit text colour. Flags pairs below AA (4.5:1 normal, 3:1 large).
 * Run: node scripts/audit-contrast.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const staticDir = ['dist', '.vercel/output/static'].map((d) => resolve(root, d)).find(existsSync);
if (!staticDir) { console.error('No build output found. Run `npm run build` first.'); process.exit(1); }

// Tailwind text-colour class -> hex/rgba
const TEXT = {
  'text-white': '#ffffff',
  'text-white/90': 'rgba(255,255,255,0.9)',
  'text-white/85': 'rgba(255,255,255,0.85)',
  'text-ink': '#0a2233',
  'text-muted': '#486472',
  'text-brand-700': '#0b5563',
  'text-brand-600': '#0e7490',
  'text-brand-200': '#a6d6de',
  'text-brand-100': '#cde8ed',
  'text-brand-50': '#e6f4f6',
  'text-cta': '#f4a23b',
};
// Background class -> the colour used for the worst-case contrast check.
// For dark bands we use the LIGHTEST stop (so light text is tested against it);
// for light bands we use the band colour.
const BG = {
  'band-dark': '#0b5563',     // lightest stop of the gradient
  'band-tint': '#f3f9fb',
  'bg-white': '#ffffff',
  'bg-white/95': '#ffffff',
  'bg-brand-50': '#e6f4f6',
  'bg-brand-800': '#094350',
  'bg-brand-700': '#0b5563',
};
const DEFAULT_BG = '#ffffff';
const VOID = new Set(['img', 'br', 'hr', 'meta', 'link', 'input', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr', 'path']);

function lum(hex) {
  const c = hex.startsWith('#') ? hex : '#ffffff';
  const rgb = [0, 1, 2].map((i) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16) / 255);
  const f = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
}
function ratio(fg, bg) {
  const L1 = lum(fg), L2 = lum(bg);
  const [a, b] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (a + 0.05) / (b + 0.05);
}

function parseClasses(s) {
  const m = s.match(/class=["']([^"']*)["']/);
  return m ? m[1].split(/\s+/).filter(Boolean) : [];
}

let failures = 0, warnings = 0;
for (const file of walk(staticDir).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(file, 'utf8');
  const rel = file.replace(staticDir + '/', '');
  const stack = [{ bg: DEFAULT_BG }];
  const re = /<(\/?)([a-zA-Z0-9]+)([^>]*)(\/?)>/g;
  let m;
  while ((m = re.exec(html))) {
    const [, closing, tag, attrs, selfClose] = m;
    if (closing) { if (stack.length > 1) stack.pop(); continue; }
    const classes = parseClasses(attrs);
    let bg = stack[stack.length - 1].bg;
    for (const c of classes) if (BG[c]) bg = BG[c];
    if (VOID.has(tag) || selfClose) continue;
    stack.push({ bg });
    // find an explicit text colour on this element
    let fg = null;
    for (const c of classes) if (TEXT[c]) { fg = TEXT[c]; break; }
    if (fg) {
      const r = ratio(fg, bg);
      if (r < 3) { failures++; console.log(`FAIL  ${rel}  ${r.toFixed(2)}:1  text="${classes.find((c) => TEXT[c]) || ''}" on bg ${bg}`); }
      else if (r < 4.5) { warnings++; console.log(`WARN  ${rel}  ${r.toFixed(2)}:1  text on bg ${bg} (ok for large text)`); }
    }
  }
}
function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc); else acc.push(p);
  }
  return acc;
}
console.log(`\nContrast audit complete: ${failures} failure(s) < 3:1, ${warnings} warning(s) 3:1–4.5:1.`);
process.exit(failures ? 1 : 0);
