// spec: specs/swag-labs-critical-path.md
// seed: tests/swag Lab tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Swag Labs critical path', () => {
  test('Locked out user cannot log in', async ({ page }) => {
    // 1. Go to https://www.saucedemo.com/. Fill username and password, click login.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test=username]').fill('locked_out_user');
    await page.locator('[data-test=password]').fill('secret_sauce!!!');
    await page.locator('[data-test=login-button]').click();

    // 2. Expect the locked out error and the URL to stay at the login page.
    await expect(page.locator('[data-test=error]')).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
