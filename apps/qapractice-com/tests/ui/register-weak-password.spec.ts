// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Register', () => {
  test('Weak password is rejected', async ({ registerPage }) => {
    // 1. Fill new.user@example.com, password "1", confirm "1", click Register.
    await registerPage.goto();
    await registerPage.register('new.user@example.com', '1', '1');
    await expect(registerPage.error).toHaveText('Password does not meet the requirements');
  });
});
