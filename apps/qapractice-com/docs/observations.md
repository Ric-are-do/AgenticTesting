---
app: qapractice-com
area: observations
title: QA Practice (qapractice.com) observations
description: Possible bugs, quirks, safety notes and locator facts seen while mapping qapractice.com
updated: 2026-11-13
---

## Possible bugs or risks

Found while planning (2026-11-13). Each one marked "test" has a known-bug test
(`*-bug.spec.ts`, `test.fail()`) that will flag when the site is fixed.

- **Forgot password:** the current password is never checked; any value
  resets the password (test). The new password may equal the old one.
- **Web forms:** letters or 2 digits accepted as a phone number (test);
  digits accepted in names; a wrongly formatted date of birth says "Date of
  Birth is required"; the published case "Invalid Email Address" can't
  happen (the browser blocks the submit first).
- **E-commerce:** quantity -1 is added and the total goes negative (test);
  payment accepts any non-empty card, expiry and CVV (test); ZIP "abc"
  accepted.
- **Flight booking:** past departure dates accepted (test); 0 passengers
  accepted; phone "abc" accepted; payment accepts any non-empty card (test).

1. The e-commerce route is misspelled: `/practice-ecommerece-website`. Not a
   bug for tests, but don't "correct" it in a page object.
2. Every page logs two 404s from `googleads.g.doubleclick.net` and an
   "Unrecognized feature: 'run-ad-auction'" warning. Third-party ads, not the
   app: don't fail tests on console errors from ad domains.

## Quirks that matter for tests

- **Practice forms are browser-only.** The privacy page says: "Nothing is
  transmitted to a server ... Nothing is saved" (not even localStorage).
  Submitting practice forms is safe and every test starts clean.
- **Contact page:** "Open email draft" opens a `mailto:` draft to the site
  owner. Don't press it in tests.
- **API playground:** a real API at `https://www.qapractice.com/api`
  (login, products, users, orders). User decision: tests may only read
  (login, GET); no POST to products or orders.
- **Locators:** almost every control has a `data-testid` (Playwright's
  default attribute), e.g. `login-email`, `forms-submit`, `add-to-cart-1`,
  `flight-search`, `ui-click-button`. Radio test ids on the UI page contain
  spaces (`ui-radio-Radio 1`).
- Each practice page publishes "Test Cases & Expected Behaviors" with exact
  messages (login TC01-08, web forms TC01-08, e-commerce TC01-08, flight
  TC01-10, UI elements TC01-12). Use them as a checklist, but check each
  expectation live.
- Demo credentials are printed on the pages themselves (fictional); the
  user approved them as code defaults (see the app's memory).
- Ads load on every page; wait for the app's own elements, not
  `networkidle`.

## Not checked

- The interview library's bookmarks and "reviewed" status (may use storage).
- UI elements: drag and drop, iframe, accordion, virtual scrolling.
- XPath challenge answers and the API responses.
