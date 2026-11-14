---
app: thatha-zonke
area: public-surface
title: Thatha Zonke public-surface test plan
description: Tests for the logged-out surface — home, search, categories, specials, restaurant browse, nav, login validation
updated: 2026-11-14
---

# Thatha Zonke — public-surface test plan

Scope: everything a logged-out visitor can reach. Ordering (cart, checkout,
tracking, dashboards) is login-gated and out of scope until there is an
approved test account. Steps come from the live site on 2026-11-14.

**Seed:** `apps/thatha-zonke/tests/seed.spec.ts`

Each scenario names its file. Scenarios tied to a confirmed bug use
`test.fail()` so the suite stays green while the bug is open; if the site is
fixed, the test goes red and tells us.

## Home & navigation

### Home loads with its hero and restaurant list
**File:** `apps/thatha-zonke/tests/ui/home-loads.spec.ts`
- Go to `/`.
- expect: heading "Local Meals. One Place." visible.
- expect: at least one `/restaurant/<id>/` link visible.

### Nav links go to login and signup
**File:** `apps/thatha-zonke/tests/ui/nav-auth-links.spec.ts`
- Go to `/`, click "Login".
- expect: URL contains `/customer_login/`; "Sign In" button visible.
- Go back to `/`, click "Sign Up".
- expect: URL contains `/signup/`; "Create Account" button visible.

## Search

### Search with no match shows an empty state
**File:** `apps/thatha-zonke/tests/ui/search-no-results.spec.ts`
- Go to `/`, search "zzzznomatchqa".
- expect: URL contains `search=zzzznomatchqa`.
- expect: 0 `/restaurant/<id>/` links.

## Categories (bug coverage)

### Category tiles should not all be empty — B1
**File:** `apps/thatha-zonke/tests/ui/category-counts-bug.spec.ts`
- Go to `/`.
- expect (currently failing — B1): the "Burgers" tile count is not "0 items".
- `test.fail()` — all real categories read 0; only "Other" has items.

### Category filter should actually filter — B2
**File:** `apps/thatha-zonke/tests/ui/category-filter-bug.spec.ts`
- Count restaurant links on `/`.
- Count restaurant links on `/?food_type=Pizza`.
- expect (currently failing — B2): the Pizza list is smaller than the full
  list. `test.fail()` — the `food_type` param is ignored, counts are equal.

## Specials (bug coverage)

### Specials should show a savings amount — B3
**File:** `apps/thatha-zonke/tests/ui/special-save-amount-bug.spec.ts`
- Go to `/`.
- expect (currently failing — B3): the first "Save R" label includes a
  number (e.g. "Save R87.50"). `test.fail()` — the amount is blank ("Save R").

## Restaurant detail

### A restaurant page shows its menu and Add-to-Cart
**File:** `apps/thatha-zonke/tests/ui/restaurant-menu.spec.ts`
- Open `/restaurant/5/`.
- expect: a "Menu" heading visible.
- expect: at least one "Add to Cart" button visible.

### Add to Cart should add an item or prompt login — B9
**File:** `apps/thatha-zonke/tests/ui/add-to-cart-requires-login.spec.ts`
- Open `/restaurant/5/`, click the first "Add to Cart".
- expect (currently failing — B9): the cart count increases, or the page
  redirects to login. `test.fail()` — logged out, the click does nothing
  (cart stays 0, no redirect, no message).

### Unknown restaurant id returns 404
**File:** `apps/thatha-zonke/tests/ui/restaurant-unknown-404.spec.ts`
- Navigate to `/restaurant/999/`.
- expect: response status 404.

## Login validation

### Invalid credentials are rejected
**File:** `apps/thatha-zonke/tests/ui/login-invalid.spec.ts`
- Go to `/customer_login/`, sign in with a bogus username/password.
- expect: still on `/customer_login/`; "Invalid credentials." visible.

### Empty login is blocked by required fields
**File:** `apps/thatha-zonke/tests/ui/login-empty.spec.ts`
- Go to `/customer_login/`, click "Sign In" with empty fields.
- expect: still on `/customer_login/`; username field is `:invalid`
  (HTML5 required).

## Aria (accessibility-tree) snapshots of main elements

One asserted `toMatchAriaSnapshot` per main element. Each page has its own
aria spec in `apps/thatha-zonke/tests/<page>/aria.spec.ts`, and its baselines
are **grouped by page** in `apps/thatha-zonke/tests/aria-snapshots/<page>/`
(the `<page>` folder comes from `{testFileDir}` via `snapshotPathTemplate` in
`playwright.config.ts`). Dynamic areas — the specials carousel and the
restaurant lists (open/closed flips by time of day) — are deliberately left
out to keep the snapshots stable. Regenerate with
`npx playwright test --project=thatha-zonke --grep aria --update-snapshots`.

- **home/** (`tests/home/aria.spec.ts`): header/nav, hero search,
  "How it works", footer.
- **restaurant/** (`tests/restaurant/aria.spec.ts`, /restaurant/5/): nav,
  menu-filter tablist.
- **login/** (`tests/login/aria.spec.ts`): the login form.
- **signup/** (`tests/signup/aria.spec.ts`): the signup form.
- **forgot-password/** (`tests/forgot-password/aria.spec.ts`): the reset form.

## Cart gate

### Cart redirects a logged-out user to login
**File:** `apps/thatha-zonke/tests/ui/cart-requires-login.spec.ts`
- Navigate to `/cart/`.
- expect: URL is `/accounts/login/?next=/cart/`.
