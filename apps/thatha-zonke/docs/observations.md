---
app: thatha-zonke
area: observations
title: Thatha Zonke observations
description: Possible bugs, quirks and inconsistencies seen while mapping and probing thatha-zonke
updated: 2026-11-14
---

# Thatha Zonke — bug analysis

Found 2026-11-14 by mapping and read-only probing of
`https://thathazonke-rl1d.onrender.com` (no account; nothing submitted that
creates data). Severity is this tester's judgement.

## Confirmed bugs

### B1 — Category tiles all show "0 items" except "Other" *(High)*
On the home "What are you craving?" row, every real category reads **0
items** — Kota 0, Chicken 0, Burgers 0, Pizza 0, Braai 0, Chips 0, Drinks 0
— while **Other** shows **8 items**. The specials and menus clearly contain
kotas, chicken, burgers and steak, so the menu items are not being tagged
with a food type; everything falls into "Other". Users browsing by craving
see empty categories.
- **See it:** load `/`, read the category tiles.

### B2 — Category filter does not filter *(High)*
The category tiles link to `/?food_type=<Type>#restaurants`, but the result
is identical whatever you pick. "Popular Restaurants" shows the same **10**
restaurant links on `/`, `/?food_type=Burgers` and `/?food_type=Pizza`. The
`food_type` query parameter is ignored. Combined with B1, category browsing
is effectively non-functional.
- **See it:** compare restaurant cards on `/` vs `/?food_type=Pizza`.

### B3 — Specials show "Save R" with no amount *(Medium)*
Every card in the "What's On Special" carousel shows the label **"Save R"**
with the rand amount missing (e.g. old R337.50 → new R250.00 should read
"Save R87.50"). The old/new prices and the "26% OFF" badge are correct and
consistent (~25.9%), so only the savings-amount string is broken — likely a
template variable that is never populated.
- **See it:** load `/`, read any special card's price block.

### B4 — Order WebSocket is forbidden (403) on every restaurant page *(Medium)*
Each `/restaurant/<id>/` page opens a WebSocket to `wss://…/ws/orders/` and
it is rejected with **HTTP 403** during the handshake, logging
`🔴 WebSocket error` to the console on every visit. Live order tracking /
updates appear broken (at least for guests). Worth confirming whether it
also fails once logged in.
- **See it:** open `/restaurant/5/`, check the browser console.

### B9 — "Add to Cart" does nothing when logged out *(Medium)*
On a restaurant page, clicking **Add to Cart** while logged out gives no
response at all: the cart badge stays **0**, there is no toast, no "please
log in" message, and no redirect. The primary call-to-action is a dead
click. The login gate is only enforced later, at the **View Cart** bar /
`/cart/`, which redirects to `/accounts/login/?next=/cart/`. Either the
button should add the item (and gate at checkout) or it should send the user
to login immediately — right now it does neither.
- **See it:** open `/restaurant/5/` logged out, click "Add to Cart", watch
  the cart stay at 0.
- **Note:** an earlier single click once redirected to
  `/customer_login/?next=%2Frestaurant%2F5%2F`, so the behaviour may be
  inconsistent/flaky — worth a closer look.

## Lower severity / polish

### B5 — `favicon.ico` returns 404 *(Low)*
Every page requests `/favicon.ico` and gets a 404. No icon, noise in logs.

### B6 — Tailwind loaded from CDN in production *(Low)*
Console warns `cdn.tailwindcss.com should not be used in production`. Fine
for a demo, but a performance/stability smell for a real deployment.

### B7 — Restaurant IDs are sequential and enumerable *(Low / info)*
Live ids are 2,3,4,5,6,19; others (1,7,8,…) return 404. Sequential integer
ids make the catalogue trivially enumerable. Not a vulnerability on its own,
but note it if any per-restaurant data should be access-controlled.

### B8 — `/logout/` returns 405 on GET *(Low / info)*
`GET /logout/` returns 405 Method Not Allowed (POST-only logout). Correct
CSRF-wise, but means a plain logout link won't work; confirm the UI uses a
POST form.

## Quirks that matter for tests

- **No `data-testid` anywhere.** Locate by role + accessible name or text.
  Many cards expose a long concatenated accessible name (emoji + shop +
  badges + price), so prefer headings/links inside a card over the card's
  own name.
- **Navigation holds the `load` event** (CDN scripts, push SW). Navigate
  with `waitUntil: 'domcontentloaded'`, like the qapractice-com app.
- **Overlays on load:** push-notification banner, "DRIVER UPDATE" toast, a
  bottom "Browse" step card, and the guided-tour dialog can overlap content.
  Dismiss or scope locators to avoid interception.
- **Invalid customer login** shows `Invalid credentials.` and stays on
  `/customer_login/`. Login inputs have HTML5 `required`.
- **Search** is a GET to `/` and reflects the query (e.g. in the empty
  state). A no-match search (`?search=zzzz…`) shows an empty state and 0
  restaurant cards.
- **Ordering is fully login-gated:** cart, checkout, tracking and dashboards
  need an account. UI tests without an account can only cover the public
  surface (home, search, categories, restaurant browse, nav, auth-form
  validation).

## Not checked (needs a decision or an account)

- **Reflected-input safety.** Search reflects the raw query; whether special
  characters are correctly escaped in every sink was **not** security-tested.
  Flag for a dedicated, authorised security review — not covered here.
- **Signup / login / staff-signup submission.** Not submitted: each creates
  a real account or sends a real application. Needs the user's go-ahead (and
  a test account) before automating the happy paths.
- **Logged-in flows:** cart totals, checkout, payment (card/EFT/cash), live
  tracking, chat, dashboards.
- **GPS "Find Food"** (needs a geolocation permission/mocked position).
