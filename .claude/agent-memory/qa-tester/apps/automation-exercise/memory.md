---
app: automation-exercise
description: Automation Exercise (https://www.automationexercise.com) rules, approvals, quirks and possible bugs
updated: 2026-11-17
---

# automation-exercise memory

## Rules and approvals
- **Full flows approved** (2026-11-17): tests may register throwaway accounts,
  place fake-card orders, send the contact form, subscribe and post reviews.
- **Accounts are created per test** (2026-11-17), unique `@example.com`
  email, and always deleted in teardown (the `newUser` / `account` fixtures).
  No stored credentials, so no credential defaults.
- **UI tests only for now** (2026-11-17); API tests come later. Calling
  `/api/createAccount` and `/api/deleteAccount` for test setup is fine.

## Quirks and possible bugs
- Ad domains are blocked by an auto fixture; Google "vignette" ads otherwise
  hijack navigation. Page objects wait for `domcontentloaded`.
- Test id attribute is `data-qa`; many list/cart/footer parts have none.
- Shared demo that throttles: 10 workers gave connection resets and 503s;
  the project is capped at 2 workers. Don't run it next to other heavy runs.
- Menu link names start with an icon glyph: match names at the end, not exact.
- The account API always answers HTTP 200; check `responseCode` in the body.
- 3 known bugs have `test.fail()` tests (`*-bug.spec.ts`); the full list
  (including the `/logout` debug-page leak) is in observations.md.

## Docs
- Journey map: `apps/automation-exercise/docs/journey-map.md`
- Observations (bugs found): `apps/automation-exercise/docs/observations.md`
- Behaviour and locators: `apps/automation-exercise/docs/shop-and-checkout.md`
- Plans: `apps/automation-exercise/specs/` (34 scenarios, 2026-11-17)
