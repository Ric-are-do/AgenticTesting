// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Login form', () => {
  test('Login with a strong password succeeds', async ({ practicePage }) => {
    // 1. Open the practice page, fill #login-email with qa.test@example.com and #login-password with Test12345!, click #login-submit.
    await practicePage.goto();
    await practicePage.loginForm.login('qa.test@example.com', 'Test12345!');
    await expect.poll(() => practicePage.dialogs).toEqual(['Login successful!']);
  });
});
