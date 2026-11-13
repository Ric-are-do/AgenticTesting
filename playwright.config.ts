import { defineConfig, devices } from '@playwright/test';
import os from 'os';
import { appProject, loadDotEnv } from './core/app';
import { apps } from './apps';

/* Load .env if present (a missing file is fine: CI has none). */
loadDotEnv();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* On CI, use half of the runner's CPU cores (minimum 1). */
  workers: process.env.CI ? Math.max(1, Math.floor(os.cpus().length / 2)) : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['json', { outputFile: 'test-results/results.json' }]],
  /* Shared settings for all the projects below. */
  use: {
    /* Headed locally, headless on CI (CI runners have no display). */
    headless: !!process.env.CI,
    /* Keep a trace and a screenshot for every failed attempt, so CI failures can be investigated. */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    /* Legacy tests (not moved into an app folder yet): everything under tests/. */
    {
      name: 'chromium',
      testDir: './tests',
      use: { ...devices['Desktop Chrome'] },
    },
    /* One project per app in apps/index.ts (testDir apps/<app>/tests, its own baseURL). */
    ...apps.map(appProject),
  ],
});
