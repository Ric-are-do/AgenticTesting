// spec: specs/swag-labs-critical-path.md
// seed: tests/swag Lab tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Swag Labs critical path', () => {
  test('Checkout step one rejects an empty form', async ({ page }) => {
    // 1. Go to https://www.saucedemo.com/. Log in as standard_user / secret_sauce
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test=username]').fill('standard_user');
    await page.locator('[data-test=password]').fill('secret_sauce');
    await page.locator('[data-test=login-button]').click();

    // 2. Add backpack, open cart, click checkout. Expect URL /checkout-step-one.html
    await page.locator('[data-test=add-to-cart-sauce-labs-backpack]').click();
    await page.locator('[data-test=shopping-cart-link]').click();
    await page.locator('[data-test=checkout]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);

    // 3. Click continue with all fields empty
    await page.locator('[data-test=continue]').click();

    // 4. Expect error message and URL to stay at /checkout-step-one.html
    await expect(page.locator('[data-test=error]')).toHaveText('Error: First Name is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
  });
});
