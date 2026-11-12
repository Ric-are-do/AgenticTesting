---
name: building-playwright-framework
description: Use when a repo has no test automation yet and Playwright tests are wanted, or when the user chose to set up a new test framework, such as "set up a test framework for this project", "start automating this app" or "add a new app to our framework". Not for working inside a repo's existing test framework (use mapping-existing-framework first).
---

# Building a Playwright framework

## Overview

Every app gets the same architecture: a shared, app-agnostic `framework/`,
one `apps/<app>/` per app, page objects that keep **locators and the methods
that use them in one file**, and fixtures that load every prerequisite lazily.
A spec states behaviour and checks it; it never touches a raw locator.

## When to use

- The repo has no test automation, or the user chose a new framework.
- Adding another app to a framework this skill already built.
- **Not** in a repo with its own existing framework: don't apply this
  strictly there. Follow its `framework-map.md`; if there's none, use
  mapping-existing-framework first. **Exception:** the user chose a new
  framework there (map decision `standard`): build it, and keep the old tests
  under "Legacy tests" (step 7).

## Process

1. **Shared part, once:** if `framework/` is missing, create it as in
   `architecture.md` and `fixtures-and-config.md` (base page, base fixtures
   with lazy per-worker login, base API client, env helper, app list,
   per-app projects in `playwright.config.ts`, `dotenv`, `tsconfig.json`
   aliases, `.env` and `playwright/.auth/` in `.gitignore`).
2. **The app:** `apps/<app>/` (`app.config.ts`, `pages/`, `components/`,
   `api/`, `data/`, `fixtures.ts`), one line in the app list,
   `tests/<app>/ui/`, `tests/<app>/api/`, `tests/<app>/seed.spec.ts`,
   `specs/<app>/`.
3. **Walk the pages live** (REQUIRED: playwright-cli) before writing a page
   object. Use the locators you saw.
4. **Credentials:** env vars only. Defaults in `app.config.ts` **only when the
   user approved it for this app**: check the agent's `decisions.md`, or the
   hand-off; record a new approval in `decisions.md`. Otherwise ask (as a
   subagent: stop and report the question). Never write a secret anywhere
   else. The base URL is not a secret: give it a default.
5. **Docs:** `docs/apps/<app>/` as in `knowledge-base.md`.
6. **Prove it:** run the app's project. Then prove the skip: run once with a
   needed variable that has no default set empty (or, if every value has a
   default, temporarily point `baseUrlVar`/a user var at an unset name with no
   default) and check the JSON report's skip reason names the variable. Undo
   the temporary change.
7. **Save the map:** write `framework-map.md` in the agent's memory folder
   from `framework-map-template.md` with decision `standard`, and its line in
   `MEMORY.md`. If the repo already had a confirmed map, **keep its rules**
   under "Legacy tests" (folder, project, rules) for tests not yet moved.

## Example

```ts
// apps/swag-labs/pages/inventory-page.ts
export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';
  readonly title: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async waitUntilLoaded() { await expect(this.title).toHaveText('Products'); }

  async addToCart(slug: string) {
    await this.page.getByTestId(`add-to-cart-${slug}`).click();
  }

  async openCart(): Promise<CartPage> {
    await this.cartLink.click();
    const cart = new CartPage(this.page);
    await cart.waitUntilLoaded();
    return cart;
  }
}

// tests/swag-labs/ui/cart.spec.ts
import { test, expect } from '@apps/swag-labs/fixtures';

test('adding an item shows it in the cart', async ({ inventoryPage }) => {
  await inventoryPage.goto();               // starts logged in
  await inventoryPage.addToCart('sauce-labs-backpack');
  const cart = await inventoryPage.openCart();
  await expect(cart.itemName('Sauce Labs Backpack')).toBeVisible();
});
```

## Common mistakes

- One-app layout (`pages/` at the root). Always `framework/` + `apps/<app>/`.
- Navigating in the spec (`cartLink.click()`). Pages return the next page.
- Logging in through the UI in every test. Log in once per worker per user.
- Credentials in a constant "because they're public". Only with approval.
- Skipping the docs or the map because "the tests pass".
