---
app: thatha-zonke
description: Thatha Zonke (onrender demo) rules, quirks and known bugs
updated: 2026-11-14
---

# thatha-zonke memory

A Django food-ordering marketplace demo on Render:
`https://thathazonke-rl1d.onrender.com` (env var `THATHA_ZONKE_URL`).
First mapped 2026-11-14.

## Rules and safety
- **No account yet.** Ordering (cart, checkout, tracking, dashboards) is
  login-gated. Signup/login/staff-signup were **not submitted** — each
  creates a real account or sends a real application. Get the user's go-ahead
  and a test account before automating those happy paths.
- **No real orders.** Don't place an order or submit the restaurant/driver
  applications.
- **Security testing is out of scope** here. Search reflects input; whether
  it's safely escaped was not tested. Note it for a dedicated authorised
  review, don't probe it ad hoc (the home-page `<script>` probe tripped a
  safety classifier on 2026-11-14).

## Quirks for tests
- **No `data-testid`.** Locate by role + accessible name / text. Navigate on
  `domcontentloaded` (CDN + push SW hold `load`); page objects extend a local
  `SitePage` that does this.
- **Overlays on load:** push-notification banner ("Not now"), "DRIVER UPDATE"
  toast, a bottom "Browse" step card, guided-tour dialog. `SitePage` has
  `dismissPushBanner()`.
- **Live restaurant ids:** 2, 3, 4, 5, 6, 19 (others 404).
- **Login gate:** `/cart/` and "View Cart" redirect to
  `/accounts/login/?next=/cart/` (next is **unencoded**). Invalid login shows
  `Invalid credentials.` and stays on `/customer_login/`.

## Known bugs (full detail in docs/observations.md)
- B1 category tiles all "0 items" except "Other" (8); food not typed.
- B2 `?food_type=` filter does nothing (all restaurants always shown).
- B3 specials show "Save R" with no amount.
- B4 `wss://…/ws/orders/` 403 on every restaurant page (console error).
- B9 "Add to Cart" logged out does nothing (cart stays 0, no redirect/msg).
- Lower: favicon 404, Tailwind CDN in prod, sequential restaurant ids,
  `/logout/` 405 on GET.
- Each bug has a `*-bug.spec.ts` `test.fail()` test (B1, B2, B3, B9).

## Docs and tests
- Journey map: `apps/thatha-zonke/docs/journey-map.md`
- Observations (bugs): `apps/thatha-zonke/docs/observations.md`
- Plan: `apps/thatha-zonke/specs/public-surface.md`
- Tests (22, all passing): 12 behaviour specs in `tests/ui/`, 5 aria specs
  (one per page) in `tests/<page>/aria.spec.ts`, + seed. Run:
  `npx playwright test --project=thatha-zonke`.
- **Aria snapshots** of main page elements are **grouped by page** in
  `apps/thatha-zonke/tests/aria-snapshots/<page>/<element>.aria.yml`. The
  `<page>` folder comes from `{testFileDir}` — each page's aria spec sits in
  its own folder `tests/<page>/aria.spec.ts`. Config:
  `expect.toMatchAriaSnapshot.pathTemplate =
  '{testDir}/aria-snapshots/{testFileDir}/{arg}{ext}'` in
  `playwright.config.ts`. NB: the `name` option flattens `/`, so the folder
  must come from the template, not the name. Dynamic areas (specials
  carousel, restaurant lists — open/closed changes by time of day) are left
  out on purpose. Regenerate with `--grep aria --update-snapshots`.
