// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { demoAccount } from '@apps/qapractice-com/app.config';

test.describe('Forgot password', () => {
  test('Wrong security code is rejected', async ({ forgotPasswordPage }) => {
    // 1. Pass step 1, fill WRONG1, click Verify Code.
    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestReset(demoAccount.email);
    await forgotPasswordPage.verifyCode('WRONG1');
    await expect(forgotPasswordPage.error).toHaveText('Invalid secret code');
  });
});
