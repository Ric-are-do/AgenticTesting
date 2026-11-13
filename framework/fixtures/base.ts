import { test as baseTest, expect, selectors } from '@playwright/test';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { AppConfig, Credentials, resolveBaseUrl, resolveUser } from '../app-config';

export type LoginFn = (page: Page, credentials: Credentials) => Promise<void>;
type AuthResult = { file: string } | { missing: string[] };

type TestFixtures = {
  loggedIn: boolean;
  credentials: Credentials;
  envGuard: void;
};
type WorkerFixtures = {
  app: AppConfig;
  user: string | undefined;
  login: LoginFn;
  /** Lazy: nothing happens until called, so logged-out and API-only tests never log in. */
  auth: () => Promise<AuthResult>;
};

export const test = baseTest.extend<TestFixtures, WorkerFixtures>({
  app: [undefined as unknown as AppConfig, { option: true, scope: 'worker' }],
  user: [undefined, { option: true, scope: 'worker' }],
  login: [
    async ({}, use) => {
      await use(async () => {
        throw new Error('No login supplied: define `login` in the app fixtures');
      });
    },
    { option: true, scope: 'worker' },
  ],

  auth: [
    async ({ app, user, login, browser }, use, workerInfo) => {
      let cached: Promise<AuthResult> | undefined;
      const run = async (): Promise<AuthResult> => {
        const resolved = resolveUser(app, user);
        if (!resolved.credentials) return { missing: resolved.missing };
        const file = path.join('playwright', '.auth', `${app.name}-${resolved.name}-${workerInfo.workerIndex}.json`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        if (app.testIdAttribute) selectors.setTestIdAttribute(app.testIdAttribute);
        const context = await browser.newContext({ baseURL: resolveBaseUrl(app) });
        try {
          const page = await context.newPage();
          await login(page, resolved.credentials);
          await context.storageState({ path: file });
        } finally {
          await context.close();
        }
        return { file };
      };
      await use(() => (cached ??= run()));
    },
    { scope: 'worker' },
  ],

  loggedIn: [true, { option: true }],

  storageState: async ({ app, loggedIn, auth, envGuard }, use, testInfo) => {
    void envGuard; // run the base-URL guard before any login
    if (!loggedIn || !app.users) return use(undefined); // no login for this test or app
    const result = await auth();
    if ('missing' in result) {
      testInfo.skip(true, `${result.missing.join(', ')} not set`);
      return use(undefined);
    }
    await use(result.file);
  },

  credentials: async ({ app, user }, use, testInfo) => {
    const resolved = resolveUser(app, user);
    if (!resolved.credentials) {
      testInfo.skip(true, `${resolved.missing.join(', ')} not set`);
      return;
    }
    await use(resolved.credentials);
  },

  envGuard: [
    async ({ app }, use, testInfo) => {
      if (!resolveBaseUrl(app)) testInfo.skip(true, `${app.baseUrlVar} not set`);
      await use();
    },
    { auto: true },
  ],
});

export { expect };
