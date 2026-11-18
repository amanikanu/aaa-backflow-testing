import { defineConfig, devices } from '@playwright/test';

// Optional end-to-end smoke tests. Not part of `npm test`.
// Usage:  npm i -D @playwright/test && npx playwright install && npx playwright test
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://localhost:4321',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 120000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
