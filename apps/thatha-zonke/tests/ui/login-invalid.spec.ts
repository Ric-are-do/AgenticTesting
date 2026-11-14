// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Login validation', () => {
  test('Invalid credentials are rejected', async ({ loginPage, page }) => {
    // 1. Go to login and submit bogus credentials.
    await loginPage.goto();
    await loginPage.signIn('nobody_qa_test', 'WrongPass123');
    // 2. Still on login, with an error.
    await expect(page).toHaveURL(/\/customer_login\//);
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
