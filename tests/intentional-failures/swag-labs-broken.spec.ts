// INTENTIONAL FAILURES: these tests are broken on purpose.
// They exist to give the CI investigator a real red run to investigate, and to
// check the token usage logging in investigate-ci.yml. Each one fails a
// different way. Delete this folder once that's been checked.

import { test, expect } from '@playwright/test';

test.describe('Intentional failures (Swag Labs)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test=username]').fill('standard_user');
    await page.locator('[data-test=password]').fill('secret_sauce');
    await page.locator('[data-test=login-button]').click();
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('broken locator: add to cart button that does not exist', async ({ page }) => {
    // Real locator is [data-test=add-to-cart-sauce-labs-backpack]
    await page.locator('[data-test=add-backpack-to-cart]').click({ timeout: 5000 });
  });

  test('wrong expected text: inventory page title', async ({ page }) => {
    // Real title is "Products"
    await expect(page.locator('[data-test=title]')).toHaveText('All Products', { timeout: 5000 });
  });

  test('wrong expected count: number of products', async ({ page }) => {
    // The inventory really shows 6 products
    await expect(page.locator('[data-test=inventory-item]')).toHaveCount(7, { timeout: 5000 });
  });
});
