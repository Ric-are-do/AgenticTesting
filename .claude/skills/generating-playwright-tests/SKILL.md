---
name: generating-playwright-tests
description: Use when turning a test plan, scenario or list of steps into Playwright test code, such as "write the test for scenario 1.3", "automate this test case" or "generate tests from specs/<plan>.md", including when the plan's seed file does not exist yet.
---

# Generating Playwright tests

## Overview

A generated test is a recording of what really happened in the browser,
written as code. **Walk every step in the live app with playwright-cli
before you write it**, then run the file and read the result honestly.

## When to use

- A plan in `specs/` (or steps from the user) needs turning into `.spec.ts`.
- Not for deciding what to test (use planning-playwright-tests) or fixing
  existing failing tests (use healing-playwright-tests).

## Process

0. **Read the framework map** (`framework-map.md` in the agent's memory) and
   follow its decision and rules. No map and the user declined mapping for
   this task → write it like the sibling specs and carry on with every step
   below. No map otherwise → stop and ask whether to map the tests first.
   A spec in the map's "Legacy tests" folder follows the legacy rules.
   - `standard`: import `test`/`expect` from `@apps/<app>/fixtures`; use
     page-object fixtures only, never `page.locator` / `page.getBy*` or
     `new XPage(page)` in a spec. A missing locator or method goes into the
     page object (rules: building-playwright-framework).
   - `existing`: write it the way the map's rules and the sibling specs do,
     even if that means raw locators. Don't impose page objects.
1. **Read the scenario** and its group's `**Seed:**` and `**File:**`.
2. **Seed:**
   - seed file missing → create it: `test.describe('<App> seed')` with a
     `test('seed')` that only opens the app's start page, in the map's style
     (standard: a page-object `goto()` through the app's fixtures);
   - seed exists → read it and never edit it. If it looks wrong for this
     scenario, do the setup inside the test and say so in your report.
3. **Walk it live** (REQUIRED: the playwright-cli skill for commands). Run
   each step and check each `- expect:` in a real browser. Use the locators
   and text you actually see: prefer `data-test`, role or visible text.
4. **Write one test per file** at the `**File:**` path (or the folder you
   were given), in the format below.
5. **Run it:** `npx playwright test "<file>"`, with the project's normal
   settings.
   - Failed? **Read the whole error first.**
   - Assertion or locator error → fix the test from the live page, re-run.
   - Infrastructure error (ENOENT, browser launch, network) → re-run once
     unchanged. Still failing → report it as infrastructure, with the error.
   - Never add or change flags (`--trace=off`, `--retries=0`, `--output`)
     to get a green run, and never report a pass you only got that way.

## File format (required)

Standard framework (an `existing` map keeps its own style, same comments):

```ts
// spec: specs/swag-labs/cart.md
// seed: tests/swag-labs/seed.spec.ts

import { test, expect } from '@apps/swag-labs/fixtures';

test.describe('Swag Labs Cart', () => {                          // group title
  test('Continue Shopping returns to inventory and keeps cart state', async ({ inventoryPage }) => {
    // 1. Login as standard_user, add the backpack, click the cart link.
    await inventoryPage.goto();                                  // starts logged in
    await inventoryPage.addToCart('sauce-labs-backpack');
    const cart = await inventoryPage.openCart();

    // 2. Click Continue Shopping.
    const inventory = await cart.continueShopping();
    await expect(inventory.cartBadge).toHaveText('1');
  });
});
```

- A `// <n>. <step text>` comment before each plan step, copied from the
  plan, one per step even when the step needs several actions.
- `describe` = the group title. `test` = the scenario title, exactly.

## Common mistakes

- Copying locators from the plan without checking them live.
- A raw locator in a standard-framework spec "just this once". Add it to the
  page object.
- Bringing page objects into a repo whose map says `existing`.
- Dropping the step comments in multi-step tests.
- Skipping a missing seed because "this scenario doesn't need it".
- Calling a test passing after a red run you didn't read.
