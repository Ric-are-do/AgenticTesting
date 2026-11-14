---
app: qapractice-com
description: QA Practice (https://www.qapractice.com) rules, approvals, quirks and possible bugs
updated: 2026-11-13
---

# qapractice-com memory

Not the same site as `qa-practice` (qaengineerwaqas.com).

## Rules and approvals
- **Credential defaults in code approved** (2026-11-13): the fictional demo
  credentials printed on the site (login page, API playground) may be code
  defaults in `apps/qapractice-com/app.config.ts`; env vars override them.
- **API tests: read-only** (2026-11-13). Login and GET only; never POST to
  `/api/products` or `/api/orders`.
- **Never press "Open email draft" on /contact** (it opens a real email to
  the site owner).
- **Scope of the first pass** (2026-11-13): the UI practice areas (login,
  register, forgot password, web forms, e-commerce, flight booking, UI
  elements). XPath challenges, the interview library and the API come later.

## Quirks and possible bugs
- Practice forms run only in the browser (the site's privacy page says
  nothing is sent or saved), so submitting them is safe.
- Ads log 404s and warnings in the console on every page and can hold the
  "load" event: page objects navigate with `waitUntil: 'domcontentloaded'`
  (`pages/site-page.ts`). Ignore ad console errors.
- `alert()` dialogs (e.g. empty shop address) block `playwright-cli`
  scripts; explore those flows with a plain Node Playwright script.
- 6 known bugs have `test.fail()` tests (`*-bug.spec.ts`); the full list is
  in observations.md.

## Docs
- Journey map: `apps/qapractice-com/docs/journey-map.md`
- Observations (bugs found): `apps/qapractice-com/docs/observations.md`
- Areas: `accounts.md`, `web-forms.md`, `e-commerce.md`,
  `flight-booking.md`, `ui-elements.md` in `apps/qapractice-com/docs/`
- Plans: `apps/qapractice-com/specs/` (78 scenarios, 2026-11-13)
