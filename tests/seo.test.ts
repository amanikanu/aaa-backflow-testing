import { describe, it, expect } from 'vitest';
import { formatTitle, canonicalUrl } from '../src/lib/seo';

describe('seo helpers', () => {
  it('formats titles with the site name', () => {
    expect(formatTitle('Pricing')).toBe('Pricing | AAA Backflow Testing');
  });

  it('canonicalizes trailing slashes', () => {
    expect(canonicalUrl('/pricing')).toBe('https://www.aaabft.com/pricing/');
    expect(canonicalUrl('/')).toBe('https://www.aaabft.com/');
  });
});
