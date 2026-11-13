// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Signup form', () => {
  test('Valid signup succeeds', async ({ practicePage }) => {
    // 1. Fill #signup-name QA Test, #signup-email qa.test@example.com, #signup-password and #signup-confirm Test12345!, click #signup-submit.
    await practicePage.goto();
    await practicePage.signupForm.signUp({ name: 'QA Test', email: 'qa.test@example.com', password: 'Test12345!', confirm: 'Test12345!' });
    await expect.poll(() => practicePage.dialogs).toEqual(['Signup Successfully']);
  });
});
