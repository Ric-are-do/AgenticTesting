// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Signup form', () => {
  test('A one-character password is accepted (known bug)', async ({ practicePage }) => {
    // 1. Fill name, email qa.test@example.com, password and confirm 1, click #signup-submit.
    await practicePage.goto();
    await practicePage.signupForm.signUp({ name: 'QA Test', email: 'qa.test@example.com', password: '1', confirm: '1' });
    await expect.poll(() => practicePage.dialogs).toEqual(['Signup Successfully']);
  });
});
