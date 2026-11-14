// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';
import { demoAccount } from '@apps/qapractice-com/app.config';

test.describe('Login', () => {
  test('Email without @ is blocked by the browser', async ({ loginPage }) => {
    // 1. Fill notanemail and the demo password, click Sign in.
    await loginPage.goto();
    await loginPage.signIn('notanemail', demoAccount.password);
    expect(await loginPage.email.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
    await expect(loginPage.error).toBeHidden();
    await expect(loginPage.success).toBeHidden();
  });
});
