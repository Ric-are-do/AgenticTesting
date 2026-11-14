// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { demoAccount } from '@apps/qapractice-com/app.config';

test.describe('Login', () => {
  test('Valid demo credentials sign in', async ({ loginPage }) => {
    // 1. Open /practice-login-form, fill the demo email and password, click Sign in.
    await loginPage.goto();
    await loginPage.signIn(demoAccount.email, demoAccount.password);
    await expect(loginPage.success).toHaveText('Login Successful! Welcome to Premium Banking.');
  });
});
