// spec: apps/automation-exercise/specs/accounts.md
// seed: apps/automation-exercise/tests/seed.spec.ts

import { test, expect } from '@apps/automation-exercise/fixtures';

test.describe('Accounts', () => {
  test('Login User with incorrect email and password', async ({ loginPage, newUser }) => {
    // 1. Open /login
    await loginPage.goto();
    await expect(loginPage.loginHeading).toBeVisible();

    // 2. Enter an email no account uses and any password, click [data-qa=login-button]
    await loginPage.submitLogin(newUser.email, newUser.password);
    await expect(loginPage.loginError).toBeVisible();
    await expect(loginPage.header.signupLoginLink).toBeVisible();
  });
});
