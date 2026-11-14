// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { demoAccount } from '@apps/qapractice-com/app.config';

test.describe('Forgot password', () => {
  test('Empty security code is reported', async ({ forgotPasswordPage }) => {
    // 1. Pass step 1 with the demo email, click Verify Code with the code empty.
    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestReset(demoAccount.email);
    await forgotPasswordPage.verifyCode();
    await expect(forgotPasswordPage.error).toHaveText('Secret code is required');
  });
});
