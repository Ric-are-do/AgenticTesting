// spec: apps/qapractice-com/specs/accounts.md
// seed: apps/qapractice-com/tests/seed.spec.ts

import { test, expect } from '@apps/qapractice-com/fixtures';

test.describe('Register', () => {
  test('Empty form asks for the email', async ({ registerPage }) => {
    // 1. Click Register with every field empty.
    await registerPage.goto();
    await registerPage.register();
    await expect(registerPage.error).toHaveText('Email is required');
  });
});
