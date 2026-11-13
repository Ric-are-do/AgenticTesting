# App knowledge

## Swag Labs (https://www.saucedemo.com)

- **Login button:** `[data-test=login-button]` (also `id="login-button"`,
  `<input type="submit" value="Login">`). There is no `#login-btn`.
- **Empty-cart checkout (possible bug):** clicking `[data-test=checkout]` with
  an empty cart goes to `/checkout-step-one.html` with no error. Seen
  2026-11-10 while planning cart tests. Not yet reported or covered by a test.
- **Cart without login:** opening `/cart.html` logged out redirects to `/`
  with `[data-test=error]` = "Epic sadface: You can only access '/cart.html'
  when you are logged in."
- **Cart persists** after a page reload.
- **Product link from cart:** `[data-test=item-4-title-link]` opens
  `/inventory-item.html?id=4` (Sauce Labs Backpack).
- **Seed:** `tests/swag Lab tests/seed.spec.ts` only does `page.goto`. It has
  no login, so each test logs in itself.
- **qa-practice** (https://qaengineerwaqas.com/qa-practice): site mapped 2026-11-13, see `docs/apps/qa-practice/journey-map.md` and `observations.md`.
