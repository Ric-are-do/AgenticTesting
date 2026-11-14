// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Register', () => {
  test('Password checklist follows what is typed', async ({ registerPage }) => {
    const rules = [
      'At least 8 characters',
      'At least one uppercase letter (A-Z)',
      'At least one lowercase letter (a-z)',
      'At least one number (0-9)',
      'At least one special character',
    ];

    // 1. Open /register.
    await registerPage.goto();
    for (const rule of rules) await expect(registerPage.passwordRule(rule)).toHaveClass(/text-danger/);

    // 2. Type "abc" into the password.
    await registerPage.password.fill('abc');
    for (const rule of rules) {
      const met = rule === 'At least one lowercase letter (a-z)';
      await expect(registerPage.passwordRule(rule)).toHaveClass(met ? /text-success/ : /text-danger/);
    }

    // 3. Type "Secret@123".
    await registerPage.password.fill('Secret@123');
    for (const rule of rules) await expect(registerPage.passwordRule(rule)).toHaveClass(/text-success/);
  });
});
