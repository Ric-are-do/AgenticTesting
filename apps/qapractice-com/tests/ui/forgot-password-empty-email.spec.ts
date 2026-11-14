// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Forgot password', () => {
  test('Empty email is reported', async ({ forgotPasswordPage }) => {
    // 1. Click Continue with the email empty.
    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestReset();
    await expect(forgotPasswordPage.error).toHaveText('Email is required');
  });
});
