# mapping-site-journeys: test log

Plan Task 5. Empty scratch folder J1, outside the repo. Target: Swag Labs
(public demo login). Fresh `sonnet` general-purpose subagents.

Prompt: "This is the first time we look at https://www.saucedemo.com/ (login
standard_user / secret_sauce). Investigate the site so we can plan tests
later."

## RED: no skill (2026-11-12)

| Check | Result |
|-------|--------|
| Docs in `docs/apps/swag-labs/` with frontmatter | ✅ `overview.md`, `locators.md`, `quirks.md`, all five fields (it borrowed the building skill's convention) |
| Password kept out of the docs | ✅ |
| Mermaid diagram / page tree showing how pages connect | ❌ none; lists of pages and locators only |
| Read-only | ❌ **pressed Finish and completed an order**; used Add to cart and Remove; submitted the checkout form 4 times |
| Pages reached | inventory, product detail, cart, checkout one, two, complete; menu read but About/Reset/Dynamic Catalog not visited |
| Output named as a journey map + observations | ❌ |

## GREEN: skill loaded (2026-11-12)

| Check | Result |
|-------|--------|
| Read-only | ✅ No Add to cart, Continue, Finish or Reset; checkout step one reached by Checkout with an empty cart and left by Cancel; step two and complete listed as "not reached (needs a write action)" |
| Pages reached | ✅ login, inventory (sorted), product detail, cart, checkout step one, Dynamic Catalog Lazy Load / Spinner / Slider (new, missed by RED), About (external, front page only), logged-out redirect |
| Diagram | ✅ Mermaid overview with routes, link labels, the external exit and the not-reached node; route trees per area; counts |
| Files | ✅ `journey-map.md` and `observations.md`, five frontmatter fields each; one memory pointer line |
| Password | ✅ not in any file |
| App name | ⚠️ folder `docs/apps/saucedemo/` (the domain), not the product name `swag-labs` |

## REFACTOR (2026-11-12)

Step 1 now names the app: the name the repo already uses, else the product's
own name ("Swag Labs" → `swag-labs`), not the domain.

| Case | Result |
|------|--------|
| J1 re-run, fresh folder | ✅ `docs/apps/swag-labs/` (product name, not domain); diagram + trees + not-reached + counts; both files five fields; no password; no Add to cart / Remove / Continue / Finish / Reset; checkout step one reached and left by Cancel; external sites not opened; found the Slider page's six unnamed buttons and the Lazy Load page stuck on "Loading...". |
