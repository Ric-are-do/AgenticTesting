// spec: apps/automation-exercise/specs/accounts.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Accounts', () => {
  test('A deleted account can no longer log in', async ({ loginPage, account }) => {
    test.slow(); // many page loads on a slow shared demo site
    // 1. With an existing account, log in and click 'Delete Account'
    await loginPage.goto();
    const home = await loginPage.login(account.email, account.password);
    const deleted = await home.header.deleteAccount();
    await expect(deleted.heading).toHaveText('Account Deleted!', { ignoreCase: true });

    // 2. Open /login and log in with the same email and password
    await loginPage.goto();
    await loginPage.submitLogin(account.email, account.password);
    await expect(loginPage.loginError).toBeVisible();
  });
});
