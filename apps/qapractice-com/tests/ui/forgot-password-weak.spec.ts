// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { demoAccount } from '@apps/qapractice-com/app.config';

test.describe('Forgot password', () => {
  test('Weak new password is rejected', async ({ forgotPasswordPage }) => {
    // 1. Reach step 3, fill demo password, short, short, click Reset Password.
    await forgotPasswordPage.goto();
    await forgotPasswordPage.reachResetStep(demoAccount.email, demoAccount.secretCode);
    await forgotPasswordPage.resetPassword(demoAccount.password, 'short', 'short');
    await expect(forgotPasswordPage.error).toHaveText('Password does not meet requirements');
  });
});
