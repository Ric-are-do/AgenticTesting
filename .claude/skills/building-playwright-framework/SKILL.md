---
name: building-playwright-framework
description: Use when a repo has no test automation yet and Playwright tests are wanted, or when the user chose to set up a new test framework, such as "set up a test framework for this project", "start automating this app" or "add a new app to our framework". Not for working inside a repo's existing test framework (use mapping-existing-framework first).
---

# Building a Playwright framework

## Overview

Every app gets the same architecture: **one folder `apps/<app>/` holds
everything about that app** (page objects, fixtures, tests, plans, docs), on
top of a small shared `core/`. Page objects keep **locators and the methods
that use them in one file**, and fixtures load prerequisites lazily.
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

1. **Shared core, once:** if `core/` is missing, create it as in
   `architecture.md` and `fixtures-and-config.md`: `core/app.ts`,
   `core/fixtures.ts`, `core/pages/base-page.ts`, the app list, per-app
   projects in `playwright.config.ts`, `dotenv`, `tsconfig.json` aliases,
   `.env` and `playwright/.auth/` in `.gitignore`. Nothing more until an app
   needs it.
2. **The app:** one folder `apps/<app>/` with `app.config.ts`, `fixtures.ts`,
   `pages/`, `components/`, `tests/seed.spec.ts`, `tests/ui/`, `specs/`,
   `docs/`, and one line in the app list. A login adds
   `tests/auth.setup.ts` (Playwright setup project); API tests add `api/`
   and `tests/api/`. No empty placeholder folders. Also create the app's
   memory, `.claude/agent-memory/qa-tester/apps/<app>/memory.md` (format in
   the agent file), and its line under "Apps" in that folder's `MEMORY.md`.
3. **Walk the pages live** (REQUIRED: playwright-cli) before writing a page
   object. Use the locators you saw.
4. **Credentials:** env vars only. Defaults in `app.config.ts` **only when the
   user approved it for this app**: check the app's memory
   (`.claude/agent-memory/qa-tester/apps/<app>/memory.md`, not the code
   folder), or the hand-off; record a new approval there.
   Otherwise ask (as a
   subagent: stop and report the question). Never write a secret anywhere
   else. The base URL is not a secret: give it a default.
5. **Docs:** `apps/<app>/docs/` as in `knowledge-base.md`.
6. **Prove it:** run the app's project. Then prove the skip: run once with a
   needed variable that has no default set empty (or, if every value has a
   default, temporarily point `baseUrlVar` (or a credential var) at an unset name with no
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

// apps/swag-labs/tests/ui/cart.spec.ts
import { test, expect } from '@apps/swag-labs/fixtures';

test('adding an item shows it in the cart', async ({ inventoryPage }) => {
  await inventoryPage.goto();               // starts logged in
  await inventoryPage.addToCart('sauce-labs-backpack');
  const cart = await inventoryPage.openCart();
  await expect(cart.itemName('Sauce Labs Backpack')).toBeVisible();
});
```

## Common mistakes

- One-app layout (`pages/` at the root), or one app spread over several
  top-level folders. Everything for an app goes in `apps/<app>/`.
- Building shared code (a login fixture, an API client) before any app
  needs it.
- Navigating in the spec (`cartLink.click()`). Pages return the next page.
- Logging in through the UI in every test. Use a setup project and reuse the
  saved state.
- Credentials in a constant "because they're public". Only with approval.
- Skipping the docs or the map because "the tests pass".
