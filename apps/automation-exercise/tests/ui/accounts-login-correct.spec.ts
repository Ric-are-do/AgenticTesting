// spec: apps/automation-exercise/specs/accounts.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Accounts', () => {
  test('Login User with correct email and password', async ({ homePage, account }) => {
    // 1. With an existing account, open the home page and click 'Signup / Login'
    await homePage.goto();
    const login = await homePage.header.openSignupLogin();
    await expect(login.loginHeading).toBeVisible();

    // 2. Enter the account's email and password and click [data-qa=login-button]
    const home = await login.login(account.email, account.password);
    await expect(home.header.loggedInAs).toContainText(`Logged in as ${account.name}`);

    // 3. Click 'Delete Account'
    const deleted = await home.header.deleteAccount();
    await expect(deleted.heading).toHaveText('Account Deleted!', { ignoreCase: true });
  });
});
