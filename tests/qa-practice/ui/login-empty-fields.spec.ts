// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Login form', () => {
  test('Login with empty fields asks to fill them', async ({ practicePage }) => {
    // 1. Open the practice page, click #login-submit without typing.
    await practicePage.goto();
    await practicePage.loginForm.login('', '');
    await expect(practicePage.loginForm.error).toHaveText('Please fill all fields');
    expect(practicePage.dialogs).toEqual([]);
  });
});
