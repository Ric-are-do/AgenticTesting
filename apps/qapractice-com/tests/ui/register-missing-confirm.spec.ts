// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Register', () => {
  test('Missing confirmation is reported', async ({ registerPage }) => {
    // 1. Fill new.user@example.com and Secret@123, leave confirm empty, click Register.
    await registerPage.goto();
    await registerPage.register('new.user@example.com', 'Secret@123');
    await expect(registerPage.error).toHaveText('Please confirm your password');
  });
});
