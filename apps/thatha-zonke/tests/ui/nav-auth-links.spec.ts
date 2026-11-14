// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Home & navigation', () => {
  test('Nav links go to login and signup', async ({ homePage, page }) => {
    // 1. Go to / and open Login.
    await homePage.goto();
    await homePage.loginLink.click();
    await expect(page).toHaveURL(/\/customer_login\//);
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
    // 2. Back home, open Sign Up.
    await homePage.goto();
    await homePage.signupLink.click();
    await expect(page).toHaveURL(/\/signup\//);
    await expect(page.getByRole('button', { name: /Create Account/i })).toBeVisible();
  });
});
