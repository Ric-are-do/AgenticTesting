import { defineConfig, devices } from '@playwright/test';
import os from 'os';
import { loadDotEnv } from './framework/helpers/env';
import { appProject } from './framework/config/app-project';
import { apps } from './apps';

/* Load .env if present (a missing file is fine: CI has none). */
loadDotEnv();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
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
    /* Legacy tests (not moved to the framework yet): everything under tests/ except the app folders. */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: apps.map((app) => `**/${app.name}/**`),
    },
    /* One project per app in apps/index.ts (testDir tests/<app>, its own baseURL). */
    ...apps.map(appProject),
  ],
});
