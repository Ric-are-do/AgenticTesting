// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Login form', () => {
  test('Login with only an email asks to fill all fields', async ({ practicePage }) => {
    // 1. Fill only #login-email with qa.test@example.com, click #login-submit.
    await practicePage.goto();
    await practicePage.loginForm.login('qa.test@example.com', '');
    await expect(practicePage.loginForm.error).toHaveText('Please fill all fields');
  });
});
