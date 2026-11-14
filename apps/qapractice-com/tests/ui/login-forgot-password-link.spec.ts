// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Login', () => {
  test('Forgot password link opens the recovery page', async ({ loginPage }) => {
    // 1. Click "Forgot password?".
    await loginPage.goto();
    const forgot = await loginPage.openForgotPassword();
    await expect(forgot.page).toHaveURL(/\/forget-password$/);
    await expect(forgot.continueButton).toBeVisible();
  });
});
