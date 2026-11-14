// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Forgot password', () => {
  test('Unknown email is rejected', async ({ forgotPasswordPage }) => {
    // 1. Fill someone@example.com, click Continue.
    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestReset('someone@example.com');
    await expect(forgotPasswordPage.error).toHaveText('Email not found in our records');
  });
});
