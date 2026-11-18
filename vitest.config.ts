import { defineConfig } from 'vitest/config';

// Unit tests only. End-to-end Playwright specs live in tests/e2e and are run
// separately (see playwright.config.ts) after `npx playwright install`.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.vercel/**', '**/tests/e2e/**'],
    environment: 'node',
  },
});
