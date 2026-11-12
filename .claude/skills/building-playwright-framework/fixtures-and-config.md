# Fixtures, login, API layer, config and secrets

## Fixtures

- `framework/fixtures/base.ts` extends `@playwright/test` and exports `test`
  and `expect`. Each `apps/<app>/fixtures.ts` extends it with the app's page
  objects, API clients and data, and supplies `login` using its own login page.
- Fixtures are lazy: one runs only if a test asks for it. Expensive things are
  worker-scoped, built on first use.
- Whatever a fixture creates in the app, its teardown removes.

### Base fixtures

| Fixture | Scope | What it does |
|---------|-------|--------------|
| `app: AppConfig` | worker option | set per project by `appProject(app)` |
| `user: string \| undefined` | worker option | `undefined` = the app's default user; switch with `test.use({ user: 'admin' })` |
| `login: (page, credentials) => Promise<void>` | worker option | supplied by the app |
| `auth` | worker | on first use: resolve the user; if credentials are complete, log in once in a new context with the project's `baseURL`, save storage state to `playwright/.auth/<app>-<user>-<workerIndex>.json` (one file per worker, no write race), return `{ file }`; else `{ missing: [...] }` |
| `loggedIn: boolean` | test option, default `true` | login-page tests set `false` |
| `storageState` | test (override) | **depends on `envGuard`** (so a missing URL skips before any login runs); `loggedIn: false` → none and `auth` is never touched; missing credentials → `testInfo.skip(true, '<VAR> not set')`; else the auth file |
| `credentials` | test | for tests that type credentials; skips the same way |
| `envGuard` | test, `auto: true` | skips with `<baseUrlVar> not set` when there's no base URL |

An API-only test that never asks for `page` never triggers a login.

## API layer

- `BaseApiClient(request: APIRequestContext, headers = {})` with protected
  `getJson<T>(url)` and `postJson<T>(url, data)`; a non-2xx response throws
  with method, URL, status and the start of the body.
- One client per app resource or service in `apps/<app>/api/`, methods named
  for what they do (`getUser(id)`, `createOrder(data)`).
- Clients are fixtures. UI tests may use them for setup and cleanup.

## Config

- `apps/index.ts` lists every app. `playwright.config.ts` calls
  `loadDotEnv()` first, keeps the existing projects for tests not yet moved,
  and adds `...apps.map(appProject)`.
- `appProject(app)` → `{ name: app.name, testDir: 'tests/' + app.name, use: {
  baseURL: resolveBaseUrl(app), app } }` plus the shared browser settings.
- `tsconfig.json` paths: `"@framework/*": ["./framework/*"]`,
  `"@apps/*": ["./apps/*"]` (`./`-prefixed, no `baseUrl`; current TypeScript
  rejects `baseUrl` and `moduleResolution: node`).
- A context you create yourself (the worker login) does **not** inherit the
  project's `use` settings. Pass `baseURL` explicitly, and if the app uses a
  custom `testIdAttribute`, set it with `selectors.setTestIdAttribute()`
  before logging in.

## Secrets

- URLs and credentials come from env vars, loaded from `.env` with `dotenv`.
  `.env` and `playwright/.auth/` (saved login sessions hold live cookies) go
  in `.gitignore`; add a `.env.example` with the variable names
  and no values. A missing `.env` must not break the run (CI has none).
- **A URL is not a secret.** Give `defaultBaseUrl` the app's known URL in
  `app.config.ts` (no approval needed), so a fresh checkout and CI run the
  tests; the env var only overrides it.
- **Missing vars: skip, loudly.** The app's tests show as skipped with the
  variable named (`ABACUS_PASSWORD not set`). Never fail the run for it; never
  drop the project silently.
- **Defaults in `app.config.ts` only when the user approved it for that app.**
  Never on your own judgement, even for "public" demo credentials. Approvals
  are per repo and live in the agent's memory (`decisions.md`), not here.
- Never write a secret into docs, plans, maps, reports or memory. Name the
  variable instead.
