// spec: apps/automation-exercise/specs/accounts.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Accounts', () => {
  test('Logout User', async ({ loginPage, account }) => {
    // 1. With an existing account, log in from /login
    await loginPage.goto();
    const home = await loginPage.login(account.email, account.password);
    await expect(home.header.loggedInAs).toContainText(`Logged in as ${account.name}`);

    // 2. Click 'Logout'
    const login = await home.header.logout();
    await expect(login.page).toHaveURL(/\/login$/);
    await expect(login.loginHeading).toBeVisible();
  });
});
