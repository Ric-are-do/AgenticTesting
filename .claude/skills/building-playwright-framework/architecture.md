# Architecture: layout, page objects, components, SOLID

## Folder layout

```
framework/                     shared, knows no app
  pages/base-page.ts           BasePage
  components/                  generic UI parts, only if reused across apps
  fixtures/base.ts             base `test`: app, user, login, auth, envGuard
  api/base-client.ts           BaseApiClient
  helpers/env.ts               loadDotEnv(), missingVars()
  app-config.ts                AppConfig, UserSpec, resolveBaseUrl(), resolveUser()
  config/app-project.ts        appProject(app) -> Playwright project
apps/index.ts                  export const apps: AppConfig[] = [ ... ]
apps/<app>/
  app.config.ts                name, baseUrlVar, users and their env vars
  pages/                       page objects
  components/                  this app's shared parts (header, sidebar, table)
  api/                         API clients
  data/                        test data builders / static data, no secrets
  fixtures.ts                  extends framework/fixtures/base.ts
tests/<app>/ui/                UI specs
tests/<app>/api/               API specs
tests/<app>/seed.spec.ts       seed for the plan -> generate flow
specs/<app>/                   test plans
docs/apps/<app>/               knowledge base
```

`<app>` is kebab-case (`swag-labs`) and is the same name everywhere. Existing
tests that aren't moved yet keep running under their current project.

## Page objects

- One class per page, or per page part with its own job.
- **Locators are `readonly` properties set in the constructor, in the same
  file as the methods that use them.** No separate locator files.
- A locator that depends on data (a row, a product) is a method returning a
  `Locator`, e.g. `itemName(name: string): Locator`.
- Methods describe intent (`login(user)`, `addToCart(slug)`), not clicks. A
  method that navigates returns the next page object, already loaded.
- Every page extends `BasePage`:
  - `constructor(readonly page: Page)`;
  - `protected abstract readonly path: string` (relative to `baseURL`);
  - `goto(): Promise<this>` opens `path`, waits until loaded, returns `this`;
  - `abstract waitUntilLoaded(): Promise<void>` (e.g. heading visible).
- Locator priority: `data-test` / test id (set `testIdAttribute` per project
  if the app uses another attribute), then role with name, then label or
  visible text. CSS/XPath only with a comment saying why.
- Assertions live in specs. Page objects have no `expect` except inside
  `waitUntilLoaded()`.

## Components

Header, sidebar, menus, tables, dialogs: a component class scoped to a root
`Locator`, held by the pages that show it (`readonly header: Header`).
Composition, not inheritance. Generic ones go in `framework/components/` only
when a second app needs them.

## SOLID, applied

- **Single responsibility:** a page knows its page, a component its widget, a
  fixture sets up and tears down, a spec states behaviour and checks.
- **Open/closed:** a new app adds files under `apps/<app>/` and
  `tests/<app>/` and one line in `apps/index.ts`. It never edits `framework/`.
  If it seems to need to, the change must be app-agnostic.
- **Liskov / interface segregation:** small base classes with only what every
  subclass needs.
- **Dependency inversion:** specs get pages and clients from fixtures, never
  `new XPage(page)`.
