// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Signup form', () => {
  test('Mismatched passwords are rejected', async ({ practicePage }) => {
    // 1. Fill name, email qa.test@example.com, #signup-password Test12345!, #signup-confirm Different1!, click #signup-submit.
    await practicePage.goto();
    await practicePage.signupForm.signUp({ name: 'QA Test', email: 'qa.test@example.com', password: 'Test12345!', confirm: 'Different1!' });
    await expect(practicePage.signupForm.error).toHaveText("Passwords don't match");
    expect(practicePage.dialogs).toEqual([]);
  });
});
