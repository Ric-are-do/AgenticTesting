// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Login', () => {
  test('Empty form shows both fields required', async ({ loginPage }) => {
    // 1. Open /practice-login-form and click Sign in with both fields empty.
    await loginPage.goto();
    await loginPage.signIn();
    await expect(loginPage.error).toHaveText('Email and Password are required');
  });
});
