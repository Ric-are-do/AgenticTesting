// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { demoAccount } from '@apps/qapractice-com/app.config';

test.describe('Forgot password', () => {
  test('Full password reset succeeds', async ({ forgotPasswordPage }) => {
    // 1. Open /forget-password, fill the demo email, click Continue.
    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestReset(demoAccount.email);
    await expect(forgotPasswordPage.code).toBeVisible();

    // 2. Fill the demo secret code, click Verify Code.
    await forgotPasswordPage.verifyCode(demoAccount.secretCode);
    await expect(forgotPasswordPage.resetButton).toBeVisible();

    // 3. Fill current = demo password, new and confirm = New@12345, click Reset Password.
    await forgotPasswordPage.resetPassword(demoAccount.password, 'New@12345', 'New@12345');
    await expect(forgotPasswordPage.success).toHaveText('Password Changed Successfully!');
  });
});
