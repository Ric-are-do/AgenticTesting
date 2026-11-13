# Core, fixtures, login, config and secrets

## The core stays small

`core/` holds only what every app needs today: `app.ts`, `fixtures.ts`,
`pages/base-page.ts` (well under 100 lines in total). **Add to it only when a
second app needs the same thing.** Don't build a login fixture, an API client
or a data layer until an app needs one, and prefer Playwright's built-in way
when there is one.

## Fixtures

- `core/fixtures.ts` extends `@playwright/test` and exports `test` and
  `expect`:
  - `app: AppConfig`: worker option, set per project by `appProject(app)`;
  - `envGuard`: auto fixture, skips with `<baseUrlVar> not set` when the app
    has no base URL.
- Each `apps/<app>/fixtures.ts` extends it with the app's page objects
  (`practicePage`, `inventoryPage`). Specs get pages from fixtures, never
  `new XPage(page)`.
- Fixtures are lazy: one runs only if a test asks for it.
- Whatever a fixture creates in the app, its teardown removes.

## Login (only for an app that has one)

Use Playwright's standard **setup project**, not a custom fixture. The first
app with a login adds this to `core/` (an app-agnostic change, the one
allowed exception to "a new app never edits `core/`"):

1. **Config:** `AppConfig` gets `login?: { requiredVars: string[] }` (the
   credential env var names). `appProject()` becomes `appProjects()` and
   returns `Project[]`; `playwright.config.ts` uses `...apps.flatMap(appProjects)`.
   For an app with `login` it returns two projects:
   - `<app>-setup`: `testDir: apps/<app>/tests`, `testMatch: /auth\.setup\.ts/`,
     and **the same `use`** as the app project (`baseURL`, `app`,
     `testIdAttribute`, device). Without them the setup finds no file, or
     its relative `goto` and `envGuard` break.
   - `<app>`: `dependencies: ['<app>-setup']`,
     `use.storageState: 'playwright/.auth/<app>.json'`.
2. **Setup test:** `apps/<app>/tests/auth.setup.ts` imports `test` from the
   app's fixtures, logs in through the login page object once and saves the
   state with `page.context().storageState({ path })`.
3. **Missing credentials must skip the dependent tests too.** A skipped setup
   counts as passed in Playwright, so the app's tests would still run with a
   missing or stale state file. So `envGuard` also skips with `<VAR> not set`
   when any of `login.requiredVars` is unset; it's an auto fixture, so it runs
   before the context is created. Keep the same skip in the setup test.
4. Login-page tests opt out with `test.use({ storageState: { cookies: [], origins: [] } })`.

Several roles: one setup test and one state file per role
(`playwright/.auth/<app>-admin.json`), chosen per file with `test.use`.

## API tests (only when the first one is needed)

Put the client in `apps/<app>/api/`, one class per resource, using
Playwright's `request` fixture; specs in `apps/<app>/tests/api/`. Move a
shared base client to `core/` only when a second app needs it.

## Config

- `apps/index.ts` lists every app. `playwright.config.ts` calls
  `loadDotEnv()` first, keeps a `chromium` project for tests not moved yet
  (`testDir: './tests'`), and adds `...apps.map(appProject)`.
- `appProject(app)` → `{ name: app.name, testDir: 'apps/' + app.name + '/tests',
  use: { baseURL: resolveBaseUrl(app), app, ... } }` plus the shared browser
  settings.
- `tsconfig.json` paths: `"@core/*": ["./core/*"]`, `"@apps/*": ["./apps/*"]`
  (`./`-prefixed, no `baseUrl`; current TypeScript rejects `baseUrl` and
  `moduleResolution: node`).

## Secrets

- URLs and credentials come from env vars, loaded from `.env` with `dotenv`.
  `.env` and `playwright/.auth/` (saved login sessions hold live cookies) go
  in `.gitignore`; add a `.env.example` with the variable names and no values
  once an app has any. A missing `.env` must not break the run (CI has none).
- **A URL is not a secret.** Give `defaultBaseUrl` the app's known URL in
  `app.config.ts` (no approval needed), so a fresh checkout and CI run the
  tests; the env var only overrides it.
- **Missing vars: skip, loudly.** The app's tests show as skipped with the
  variable named (`ABACUS_PASSWORD not set`). Never fail the run for it; never
  drop the project silently.
- **Credential defaults in code only when the user approved it for that app.**
  Never on your own judgement, even for "public" demo credentials. Approvals
  are per app and live in the app's memory (`apps/<app>/memory.md` in the
  agent's memory folder), not here.
- Never write a secret into docs, plans, maps, reports or memory. Name the
  variable instead.
