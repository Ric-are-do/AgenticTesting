// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Login form', () => {
  test('Weak password is accepted (known bug)', async ({ practicePage }) => {
    // 1. Fill #login-email with not-an-email and #login-password with x, click #login-submit.
    await practicePage.goto();
    await practicePage.loginForm.login('not-an-email', 'x');
    await expect.poll(() => practicePage.dialogs).toEqual(['Login successful (bug: weak password accepted)']);
  });
});
