// spec: apps/thatha-zonke/specs/public-surface.md
// seed: apps/thatha-zonke/tests/seed.spec.ts

import { test, expect } from '@apps/thatha-zonke/fixtures';

test.describe('Restaurant detail', () => {
  // BUG B9: clicking "Add to Cart" while logged out does nothing — the cart
  // count stays 0 and the user is not sent to login. The primary CTA is a
  // dead click. (Logging in is required; the gate is enforced at /cart/ via
  // the "View Cart" bar, which does redirect — see cart-requires-login.)
  test.fail('Add to Cart should add an item or prompt login (B9)', async ({ restaurantPage, page }) => {
    // 1. Open a restaurant and note the cart count.
    await restaurantPage.open(5);
    const cart = page.getByRole('link', { name: /Cart/ }).first();
    await expect(cart).toContainText('0');
    // 2. Click Add to Cart.
    await restaurantPage.addToCartButtons.first().click();
    await page.waitForTimeout(2000);
    // 3. Expect SOME response: either the cart count increases, or we are sent
    //    to login. Currently neither happens, so this fails (bug open).
    const onLogin = /login/.test(page.url());
    const cartText = await cart.innerText();
    expect(onLogin || !/\b0\b/.test(cartText)).toBe(true);
  });
});
