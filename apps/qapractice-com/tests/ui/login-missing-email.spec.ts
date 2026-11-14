// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { demoAccount } from '@apps/qapractice-com/app.config';

test.describe('Login', () => {
  test('Missing email is reported', async ({ loginPage }) => {
    // 1. Fill only the demo password and click Sign in.
    await loginPage.goto();
    await loginPage.signIn(undefined, demoAccount.password);
    await expect(loginPage.error).toHaveText('Email is required');
  });
});
