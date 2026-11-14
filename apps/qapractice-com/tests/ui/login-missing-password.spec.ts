// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { demoAccount } from '@apps/qapractice-com/app.config';

test.describe('Login', () => {
  test('Missing password is reported', async ({ loginPage }) => {
    // 1. Fill only the demo email and click Sign in.
    await loginPage.goto();
    await loginPage.signIn(demoAccount.email);
    await expect(loginPage.error).toHaveText('Password is required');
  });
});
