import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cfg = readFileSync(join(__dirname, '../astro.config.mjs'), 'utf8');

describe('legacy redirects', () => {
  it('maps /faqs.html -> /faq/', () => {
    expect(cfg).toMatch(/\/faqs\.html['"]?\s*:\s*['"]\/faq\//);
  });
  it('maps /aboutus.html -> /about/', () => {
    expect(cfg).toMatch(/\/aboutus\.html['"]?\s*:\s*['"]\/about\//);
  });
});
