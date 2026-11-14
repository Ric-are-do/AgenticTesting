// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Login', () => {
  test('Password is masked', async ({ loginPage }) => {
    // 1. Open the login page.
    await loginPage.goto();
    await expect(loginPage.password).toHaveAttribute('type', 'password');
  });
});
