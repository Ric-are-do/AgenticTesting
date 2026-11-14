// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Login validation', () => {
  test('Empty login is blocked by required fields', async ({ loginPage, page }) => {
    // 1. Go to login and submit with empty fields.
    await loginPage.goto();
    await loginPage.signInButton.click();
    // 2. Still on login; the username field fails HTML5 required validation.
    await expect(page).toHaveURL(/\/customer_login\//);
    await expect(loginPage.username).toHaveJSProperty('validity.valid', false);
  });
});
