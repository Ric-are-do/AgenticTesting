---
app: automation-exercise
area: observations
title: Automation Exercise observations
description: Possible bugs, quirks, safety notes and locator facts seen while mapping and planning automationexercise.com
updated: 2026-11-17
---

## Possible bugs or risks

Each one marked "test" has a known-bug test (`*-bug.spec.ts`, `test.fail()`)
that will flag when the site is fixed.

1. **Quantity 0 or below is accepted** (test): quantity 0 on a product page
   adds a row "0 / Rs. 0"; -1 adds "-1 / Rs. -500". Quantities add up, so a
   cart can reach a total of 0 and still be checked out (`/payment_done/0`).
2. **Payment accepts any card** (test): card number "abcd", month 13, year
   1999, CVC "1" all give "ORDER PLACED!". Only empty fields are blocked (by
   the browser's `required`).
3. **`/logout` while logged out returns HTTP 500** (test) with a full Django
   debug page ("KeyError at /logout": traceback, settings, request data).
   Debug mode is on in production: an information leak. Not probed further.
4. Opening `/account_created` or `/delete_account` by URL while logged out
   shows "ACCOUNT CREATED!" / "ACCOUNT DELETED!" although nothing happened.
5. A search with no results shows only the "SEARCHED PRODUCTS" heading, no
   "no products found" message.
6. Searching "dress" also returns "Sleeves Top and Short - Blue & Pink"
   (matches on category, not name).

## Quirks that matter for tests

- **Throttling:** a shared public demo. With 10 parallel browsers it reset
  connections and answered 503 (2026-11-17); pages take 1-4 s each. The
  project is capped at 2 workers (`app.config.ts`), and long checkout flows
  are `test.slow()`. When busy it serves its own page "This website is under
  heavy load (queue full)"; `SitePage.waitUntilLoaded()` reports that by name.
- **Menu and category link names start with an icon-font glyph** (" Home"),
  so exact name matches fail; page objects match the name at the end.
- **jQuery handlers** ("Proceed To Checkout", "Add to cart", the contact
  form) only work after the load event: `SitePage.waitUntilLoaded()` waits
  for the page's content and then for `load`.

- **Ads:** Google ads (including full-page "vignette" ads that hijack
  navigation) load on every page. The app's fixtures abort ad-domain
  requests; page objects wait for `domcontentloaded`.
- **Test ids are `data-qa`** (forms, buttons, result pages), set as
  `testIdAttribute` in `app.config.ts`. Product lists, cart rows, sidebar and
  footer have no `data-qa`: use ids (`#cart_info_table`, `#susbscribe_email`
  [sic], `#scrollUp`) or classes, with a comment.
- Product cards render "Add to cart" twice (card and hover overlay): use
  `.productinfo a.add-to-cart[data-product-id=N]`.
- The cart is per session, not per account: items added while logged out are
  still there after logging in. Placing an order empties it.
- The contact form asks `confirm("Press OK to proceed!")`; accepting it
  shows "Success! Your details have been submitted successfully.".
  `.alert-success` matches 2 elements: scope it to `.contact-form`.
- Account API (`/api/createAccount`, `/api/deleteAccount`) always returns
  HTTP 200; the real result is `responseCode` in the JSON body (201 created,
  400 "Email already exists!", 200 deleted, 404 "Account not found!").
- Order totals and the invoice: invoice is `invoice.txt`, "Hi <name>, Your
  total purchase amount is <total>. Thank you".

## Safety notes

- The user approved full flows (2026-11-17): tests may register throwaway
  accounts (unique `@example.com` email), place fake-card orders, send the
  contact form, subscribe and post reviews. Every account a test creates is
  deleted in teardown.

## Not checked

- Contact form with the confirm dismissed; the API endpoints themselves (UI
  only for now); the YouTube channel.
