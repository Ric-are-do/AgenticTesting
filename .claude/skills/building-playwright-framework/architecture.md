# Architecture: layout, page objects, components, SOLID

## Folder layout

**Each app folder holds everything about that app.** A small shared `core/`
holds only what every app needs.

```
core/                          shared, knows no app (keep it small)
  app.ts                       AppConfig, loadDotEnv(), resolveBaseUrl(), appProject()
  fixtures.ts                  base `test`: `app` option + auto `envGuard` skip
  pages/base-page.ts           BasePage: goto(), waitUntilLoaded()
apps/index.ts                  export const apps: AppConfig[] = [ ... ]
apps/<app>/                    EVERYTHING about one app
  app.config.ts                name, base URL env var + default
  fixtures.ts                  this app's `test`, extending core/fixtures.ts
  pages/                       page objects
  components/                  this app's shared parts (header, sidebar, forms)
  tests/
    seed.spec.ts               seed for the plan -> generate flow
    ui/                        UI specs, one scenario per file
    auth.setup.ts              only for an app with a login (see fixtures-and-config.md)
  specs/                       test plans
  docs/                        knowledge base (frontmatter on every file)
```

`<app>` is kebab-case (`swag-labs`) and is the same name everywhere: folder,
Playwright project, `app.config.ts` `name`. Tests not moved into an app
folder yet stay under `tests/` and run in the `chromium` project ("Legacy
tests" in the framework map).

**Add folders when they're needed, not before.** No empty `api/`, `data/` or
`tests/api/` placeholders. An app's first API test adds `apps/<app>/api/` and
`apps/<app>/tests/api/`; shared test data adds `apps/<app>/data/`.

## Page objects

- One class per page, or per page part with its own job.
- **Locators are `readonly` properties set in the constructor, in the same
  file as the methods that use them.** No separate locator files.
- A locator that depends on data (a row, a product) is a method returning a
  `Locator`, e.g. `row(id: number): Locator`.
- Methods describe intent (`login(user)`, `addToCart(slug)`), not clicks. A
  method that navigates returns the next page object, already loaded.
- Every page extends `BasePage`:
  - `constructor(readonly page: Page)`;
  - `protected abstract readonly path: string` (relative to `baseURL`);
  - `goto(): Promise<this>` opens `path`, waits until loaded, returns `this`;
  - `abstract waitUntilLoaded(): Promise<void>` (e.g. heading visible).
- Locator priority: test id (`getByTestId`, default `data-testid`; set
  `testIdAttribute` in `app.config.ts` if the app uses another attribute),
  then role with name, then label or visible text. CSS (e.g. `#id`) only when
  an element has none of these, with a comment saying why.
- Assertions live in specs. Page objects have no `expect` except inside
  `waitUntilLoaded()`.

## Components

Header, sidebar, menus, tables, forms, dialogs: a component class held by the
pages that show it (`readonly loginForm: LoginForm`). Composition, not
inheritance. A component moves to `core/` only when a second app needs the
same one.

## SOLID, applied

- **Single responsibility:** a page knows its page, a component its widget, a
  fixture sets up and tears down, a spec states behaviour and checks.
- **Open/closed:** a new app adds one folder `apps/<app>/` and one line in
  `apps/index.ts`. It never edits `core/`. If it seems to need to, the change
  must be app-agnostic.
- **Liskov / interface segregation:** small base classes with only what every
  subclass needs.
- **Dependency inversion:** specs get pages from fixtures, never
  `new XPage(page)`.
