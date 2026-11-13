import { test as base, expect } from '@playwright/test';
import { AppConfig, resolveBaseUrl } from './app';

type CoreFixtures = {
  /** Skips the test, loudly, when the app has no base URL. Runs automatically. */
  envGuard: void;
};
type CoreWorkerFixtures = {
  /** Set per project by appProject(). */
  app: AppConfig;
};

/** Base `test` every app's fixtures.ts extends. */
export const test = base.extend<CoreFixtures, CoreWorkerFixtures>({
  app: [undefined as unknown as AppConfig, { option: true, scope: 'worker' }],
  envGuard: [
    async ({ app }, use, testInfo) => {
      // No app (a project not created by appProject): nothing to check.
      if (app && !resolveBaseUrl(app)) testInfo.skip(true, `${app.baseUrlVar} not set`);
      await use();
    },
    { auto: true },
  ],
});

export { expect };
