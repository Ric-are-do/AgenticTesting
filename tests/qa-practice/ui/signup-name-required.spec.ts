// spec: specs/qa-practice/practice-page.md
// seed: tests/qa-practice/seed.spec.ts

import { test, expect } from '@apps/qa-practice/fixtures';

test.describe('Signup form', () => {
  test('Empty signup asks for a name', async ({ practicePage }) => {
    // 1. Click #signup-submit without typing.
    await practicePage.goto();
    await practicePage.signupForm.signUp({});
    await expect(practicePage.signupForm.error).toHaveText('Name required');
    expect(practicePage.dialogs).toEqual([]);
  });
});
