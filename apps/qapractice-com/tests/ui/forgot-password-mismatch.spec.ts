// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { demoAccount } from '@apps/qapractice-com/app.config';

test.describe('Forgot password', () => {
  test('New passwords that differ are rejected', async ({ forgotPasswordPage }) => {
    // 1. Reach step 3, fill demo password, New@12345, Other@123, click Reset Password.
    await forgotPasswordPage.goto();
    await forgotPasswordPage.reachResetStep(demoAccount.email, demoAccount.secretCode);
    await forgotPasswordPage.resetPassword(demoAccount.password, 'New@12345', 'Other@123');
    await expect(forgotPasswordPage.error).toHaveText('Passwords do not match');
  });
});
