// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { demoAccount } from '@apps/qapractice-com/app.config';

test.describe('Forgot password', () => {
  test('Empty reset fields are reported', async ({ forgotPasswordPage }) => {
    // 1. Reach step 3 and click Reset Password with all fields empty.
    await forgotPasswordPage.goto();
    await forgotPasswordPage.reachResetStep(demoAccount.email, demoAccount.secretCode);
    await forgotPasswordPage.resetPassword();
    await expect(forgotPasswordPage.error).toHaveText('All fields are required');
  });
});
