// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { demoAccount } from '@apps/qapractice-com/app.config';

test.describe('Forgot password', () => {
  test('Wrong current password is rejected (known bug)', async ({ forgotPasswordPage }) => {
    // Known bug (seen 2026-11-13): a wrong current password still gives "Password Changed Successfully!".
    // The test states the correct behaviour and is expected to fail until the
    // site is fixed; then Playwright reports it as an unexpected pass.
    test.fail(true, 'Known bug: a wrong current password still gives "Password Changed Successfully!".');
    // 1. Reach step 3, fill current = Wrong@123, new and confirm = New@12345, click Reset Password.
    await forgotPasswordPage.goto();
    await forgotPasswordPage.reachResetStep(demoAccount.email, demoAccount.secretCode);
    await forgotPasswordPage.resetPassword('Wrong@123', 'New@12345', 'New@12345');
    await expect(forgotPasswordPage.error).toBeVisible();
    await expect(forgotPasswordPage.success).toBeHidden();
  });
});
