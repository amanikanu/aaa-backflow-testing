import { describe, it, expect } from 'vitest';
import { publishedFaqs, faqPreview } from '../src/content/faq';

describe('faq content', () => {
  it('excludes TODO items from the public site', () => {
    const ids = publishedFaqs().map((f) => f.id);
    expect(ids).not.toContain('how-long');
  });

  it('preview returns at most N items', () => {
    expect(faqPreview(4).length).toBeLessThanOrEqual(4);
  });

  it('migrated and new questions are present', () => {
    const ids = publishedFaqs().map((f) => f.id);
    expect(ids).toEqual(expect.arrayContaining(['cost', 'failed-device', 'who-needs-device', 'what-is-backflow', 'why-annual', 'how-often', 'how-to-prepare']));
  });
});
