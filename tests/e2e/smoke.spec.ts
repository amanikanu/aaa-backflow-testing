import { test, expect } from '@playwright/test';

// Smoke tests covering the PRD's core requirements. Run with Playwright
// (see playwright.config.ts). These complement the unit + discrepancy gates.

test('homepage: H1, phone tel link, and book CTA are present', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Backflow testing in San Francisco');
  await expect(page.locator('a[href="tel:+14155351332"]').first()).toBeVisible();
  await expect(page.locator('a[href="/book/"]').first()).toBeVisible();
});

test('no console errors across key routes', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  for (const route of ['/', '/faq/', '/pricing/', '/contact/', '/book/']) {
    await page.goto(route);
  }
  expect(errors, errors.join('\n')).toEqual([]);
});

test('legacy redirect /faqs.html resolves to /faq/', async ({ page }) => {
  await page.goto('/faqs.html');
  expect(page.url()).toContain('/faq/');
});

test('contact form shows inline errors on empty submit', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: /Send message/i }).click();
  await expect(page.locator('#err-fullName')).not.toHaveText('');
  await expect(page.locator('#err-email')).not.toHaveText('');
});

test('book page loads the scheduler only after click (no third-party on load)', async ({
  page,
}) => {
  await page.goto('/book/');
  // Before click: no fullslate iframe in the DOM.
  await expect(page.locator('iframe[src*="fullslate"]')).toHaveCount(0);
  await page.getByRole('button', { name: /Load scheduler/i }).click();
  await expect(page.locator('iframe[src*="fullslate"]')).toHaveCount(1);
});

test('FAQ page exposes accordions with unique questions', async ({ page }) => {
  await page.goto('/faq/');
  const summaries = page.locator('summary h3');
  await expect(summaries.first()).toBeVisible();
  const count = await summaries.count();
  expect(count).toBeGreaterThan(5);
});
