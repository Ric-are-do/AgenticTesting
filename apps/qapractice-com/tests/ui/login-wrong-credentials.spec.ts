// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Login', () => {
  test('Wrong credentials are rejected', async ({ loginPage }) => {
    // 1. Fill wrong@example.com and nope1234, click Sign in.
    await loginPage.goto();
    await loginPage.signIn('wrong@example.com', 'nope1234');
    await expect(loginPage.error).toHaveText('Invalid email id and password');
    await expect(loginPage.success).toBeHidden();
  });
});
