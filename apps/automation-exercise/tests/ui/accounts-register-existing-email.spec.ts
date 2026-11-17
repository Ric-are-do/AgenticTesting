// spec: apps/automation-exercise/specs/accounts.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Accounts', () => {
  test('Register User with existing email', async ({ loginPage, account }) => {
    // 1. With an existing account, open /login
    await loginPage.goto();
    await expect(loginPage.signupHeading).toBeVisible();

    // 2. Enter a name and the account's email in the signup form, click [data-qa=signup-button]
    await loginPage.submitSignup('Another Name', account.email);
    await expect(loginPage.signupError).toBeVisible();
    await expect(loginPage.accountInformationHeading).toBeHidden();
  });
});
