// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Login', () => {
  test('Register link opens the register page', async ({ loginPage }) => {
    // 1. Click "Register now".
    await loginPage.goto();
    const register = await loginPage.openRegister();
    await expect(register.page).toHaveURL(/\/register$/);
    await expect(register.registerButton).toBeVisible();
  });
});
