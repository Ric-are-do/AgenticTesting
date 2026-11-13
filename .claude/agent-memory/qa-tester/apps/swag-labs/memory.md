---
app: swag-labs
description: Swag Labs (https://www.saucedemo.com) rules, approvals, quirks and possible bugs
updated: 2026-11-13
---

# Swag Labs memory

## Rules and approvals
- **Credential defaults in code approved** (2026-11-12): the user approved its
  public demo login as code defaults in `apps/swag-labs/app.config.ts`.
  That file doesn't exist yet: it's created when Swag Labs moves into
  `apps/swag-labs/` (TODO item 8). The approval applies from then on.

## Quirks and possible bugs
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

## Docs
- None yet. The tests are legacy, in `tests/swag Lab tests/` (TODO item 8
  moves them to `apps/swag-labs/`).
