// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Register', () => {
  test('Mismatched passwords are rejected', async ({ registerPage }) => {
    // 1. Fill new.user@example.com, Secret@123, Other@123, click Register.
    await registerPage.goto();
    await registerPage.register('new.user@example.com', 'Secret@123', 'Other@123');
    await expect(registerPage.error).toHaveText('Passwords do not match');
  });
});
