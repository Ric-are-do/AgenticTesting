// spec: apps/automation-exercise/specs/accounts.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Accounts', () => {
  test('Opening logout while logged out does not show a server error', async ({ loginPage }) => {
    // Known bug (seen 2026-11-17): HTTP 500 and a Django debug page ("KeyError at /logout")
    // that exposes the traceback and settings. Remove test.fail() once fixed.
    test.fail(true, 'Known bug: /logout while logged out returns HTTP 500 with a debug page');

    // 1. Without logging in, open /logout
    const status = await loginPage.openLogoutUrl();
    expect(status).toBeLessThan(500);
    await expect(loginPage.serverErrorPage).toBeHidden();
  });
});
