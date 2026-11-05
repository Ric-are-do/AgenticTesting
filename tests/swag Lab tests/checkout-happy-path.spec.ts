// spec: specs/swag-labs-critical-path.md
// seed: tests/swag Lab tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Swag Labs critical path', () => {
  test('Complete purchase of two items as standard_user', async ({ page }) => {
    // 1. Go to the site, log in as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test=username]').fill('standard_user');
    await page.locator('[data-test=password]').fill('secret_sauce');
    await page.locator('[data-test=login-button]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test=inventory-item]')).toHaveCount(6);

    // 2. Add backpack and bike light to the cart
    await page.locator('[data-test=add-to-cart-sauce-labs-backpack]').click();
    await page.locator('[data-test=add-to-cart-sauce-labs-bike-light]').click();
    await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveText('2');
    await expect(page.locator('[data-test=remove-sauce-labs-backpack]')).toBeVisible();
    await expect(page.locator('[data-test=remove-sauce-labs-bike-light]')).toBeVisible();

    // 3. Open the cart
    await page.locator('[data-test=shopping-cart-link]').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('[data-test=inventory-item-name]')).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);

    // 4. Click checkout
    await page.locator('[data-test=checkout]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // 5. Fill customer information and continue
    await page.locator('[data-test=firstName]').fill('John');
    await page.locator('[data-test=lastName]').fill('Doe');
    await page.locator('[data-test=postalCode]').fill('12345');
    await page.locator('[data-test=continue]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // 6. Verify overview
    await expect(page.locator('[data-test=subtotal-label]')).toHaveText('Item total: $39.98');
    await expect(page.locator('[data-test=tax-label]')).toHaveText('Tax: $3.20');
    await expect(page.locator('[data-test=total-label]')).toHaveText('Total: $43.18');
    await expect(page.locator('[data-test=payment-info-value]')).toHaveText('SauceCard #31337');
    await expect(page.locator('[data-test=shipping-info-value]')).toHaveText('Free Pony Express Delivery!');

    // 7. Finish the order
    await page.locator('[data-test=finish]').click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('[data-test=complete-header]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test=complete-text]')).toHaveText(
      'Your order has beendispatched, and will arrive just as fast as the pony can get there!'
    );

    // 8. Back to products
    await page.locator('[data-test=back-to-products]').click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test=shopping-cart-badge]')).toHaveCount(0);
  });
});
