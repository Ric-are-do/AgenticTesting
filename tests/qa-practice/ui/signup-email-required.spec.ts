// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Signup form', () => {
  test('Signup without an email asks for a valid email', async ({ practicePage }) => {
    // 1. Fill only #signup-name QA Test, click #signup-submit.
    await practicePage.goto();
    await practicePage.signupForm.signUp({ name: 'QA Test' });
    await expect(practicePage.signupForm.error).toHaveText('Enter Valid Email Address');
    expect(practicePage.dialogs).toEqual([]);
  });
});
