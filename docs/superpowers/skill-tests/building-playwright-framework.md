# building-playwright-framework: test log

Plan Task 2. Scratch project B1: an empty Node project with
`@playwright/test` 1.65.0, outside the repo. Target: Swag Labs. Fresh `sonnet`
general-purpose subagents, run one at a time.

Prompt (same every run): "Set up a Playwright test framework for Swag Labs
(https://www.saucedemo.com/) and write a login test and an add-to-cart test.
The public demo login is standard_user / secret_sauce. Run the tests and make
sure they pass."

## RED: no skill (2026-11-12)

Result: `3 passed`. A tidy single-app POM, but not our architecture.

| Check | Result |
|-------|--------|
| Locators and methods in the same page-object file | ✅ `readonly` locators set in the constructor |
| No raw locators in specs | ✅ |
| Page objects as fixtures (no `new XPage` in specs) | ✅ |
| `framework/` vs `apps/<app>/` split (multi-app) | ❌ `pages/`, `fixtures/`, `tests/` at the root, one app only |
| `tests/<app>/ui` and `tests/<app>/api` | ❌ |
| `BasePage` with `waitUntilLoaded()` | ❌ no base class |
| Navigation methods return the next page object | ❌ the spec does `loggedInInventory.cartLink.click()` |
| Credentials from env vars, skip loudly when missing | ❌ hardcoded `users` constant in `fixtures/index.ts`, no env handling, no rule about approval |
| Login once per worker, saved state | ❌ `loggedInInventory` logs in through the UI in every test |
| Named users, `test.use({ user })` | ❌ one user |
| API layer (`BaseApiClient`, clients as fixtures) | ❌ |
| One Playwright project per app from an app list | ❌ single project, `baseURL` hardcoded |
| `docs/apps/<app>/` with frontmatter | ❌ no docs |
| `framework-map.md` in agent memory, decision `standard` | ❌ |

Quote: "Credentials: in a `users` constant in this file (the demo's public
`standard_user` / `secret_sauce`)."

## GREEN: skill loaded (2026-11-12)

Same prompt plus "the user has approved these as code defaults for Swag Labs".
Checked by me after the run, not only from the report.

| Check | Result |
|-------|--------|
| Layout | ✅ `framework/` (app-config, env, base page, base fixtures, base client, app-project) + `apps/index.ts` + `apps/swag-labs/` + `tests/swag-labs/{ui,api}` + `specs/swag-labs/` |
| No raw locators or `new XPage(` in specs | ✅ grep empty |
| Navigation returns the next page | ✅ `const cart = await inventoryPage.openCart()` |
| Lazy per-worker login with saved state | ✅ |
| Credentials | ✅ defaults only in `app.config.ts`, overridable by env vars |
| Skip loudly | ✅ `SWAG_LABS_URL= npx playwright test` → `4 skipped`, JSON reason `SWAG_LABS_URL not set` |
| Docs | ✅ `overview.md`, `journeys.md`, all five frontmatter fields; no password in docs or map |
| Map | ✅ `framework-map.md`, `Decision: standard`, every template section |
| Run | ✅ `4 passed (4.4s)` (re-run by me); `tsc --noEmit` exit 0 |

Gaps found (fixed in REFACTOR):
- No default base URL, so a fresh checkout or CI would skip every test. The
  skill treated the URL like a secret. → "A URL is not a secret: give it a
  default."
- The worker login's own context ignored the project's `testIdAttribute`, so
  login failed until the agent found it. → note in `fixtures-and-config.md`.
- `tsconfig.json` with `baseUrl` was rejected by current TypeScript. → exact
  `./`-prefixed paths in the reference.
- The skip check step assumed a variable without a default. → step 6 rewritten.

## REFACTOR: fresh project, updated skill (2026-11-12)

✅ `4 passed (4.1s)`, `tsc` clean, specs clean, default base URL present
(fresh checkout runs), no secret in docs or map, `.env.example` with names
only, docs now include `journey-map.md`.

Skip check: the agent pointed `baseUrlVar` at an unset name and removed the
default, got `4 skipped` with reason `SWAG_LABS_UNSET_URL_VAR not set`, then
restored the config. New gap it found on the way: `storageState` ran the
worker login before `envGuard` could skip (2 failures). → reference now says
`storageState` depends on `envGuard`.

Not exercised: the missing-credentials skip (Swag Labs has approved defaults).
