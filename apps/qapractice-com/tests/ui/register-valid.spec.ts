// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Register', () => {
  test('Valid registration succeeds', async ({ registerPage }) => {
    // 1. Open /register, fill new.user@example.com, Secret@123, Secret@123, click Register.
    await registerPage.goto();
    await registerPage.register('new.user@example.com', 'Secret@123', 'Secret@123');
    await expect(registerPage.success).toHaveText('Registration Successful');
  });
});
