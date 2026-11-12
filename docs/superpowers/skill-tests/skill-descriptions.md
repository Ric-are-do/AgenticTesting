# Skill descriptions: routing test log

Plan Task 1. Fresh `sonnet` subagents get only the skill names + descriptions
and say which skill they'd load for 6 requests. 5 reps per round.

Requests and the right answer:

| # | Request | Right |
|---|---------|-------|
| 1 | Why did the Playwright job fail on main last night? | investigate-ci-failure |
| 2 | Open saucedemo and check the login button is visible | playwright-cli |
| 3 | Take a screenshot of the cart page | playwright-cli |
| 4 | The checkout-happy-path test fails when I run it locally | none (yet) |
| 5 | Write a test plan for the Swag Labs cart | none (yet) |
| 6 | Load-test the API | none |

## RED: old descriptions (2026-11-10)

- playwright-cli: "Automate browser interactions, test web pages and work with Playwright tests."
- investigate-ci-failure: "Investigate why the Playwright tests failed in GitHub Actions. Finds the latest failed run on main ..., downloads its artifacts, ... and writes a markdown report. ..."

| Rep | 1 | 2 | 3 | 4 | 5 | 6 |
|-----|---|---|---|---|---|---|
| 1 | ci ✅ | cli ✅ | cli ✅ | none ✅ | none ✅ | none ✅ |
| 2 | ci ✅ | cli ✅ | cli ✅ | none ✅ | none ✅ | none ✅ |
| 3 | ci ✅ | cli ✅ | cli ✅ | **cli ❌** | none ✅ | none ✅ |
| 4 | ci ✅ | cli ✅ | cli ✅ | **cli ❌** | **cli ❌** | none ✅ |
| 5 | ci ✅ | cli ✅ | cli ✅ | **cli ❌** | **cli ❌** | none ✅ |

Failure: "work with Playwright tests" pulls test debugging (3/5) and test
planning (2/5) into playwright-cli. Quotes: "a locally failing Playwright
test is Playwright test work"; "exploring the Swag Labs cart in a browser is
needed to write the plan".

## GREEN: new descriptions (2026-11-10)

- playwright-cli: "Use when a task needs a live browser driven by hand from the command line, such as opening a URL, clicking or typing on a page, checking that an element or text is visible, taking a screenshot or page snapshot, or finding a locator for an element. Not on its own for planning, writing or fixing Playwright test files."
- investigate-ci-failure: "Use when Playwright tests failed in GitHub Actions or CI, such as "why did CI fail", "the Playwright job is red on main", a failed run ID or run link, or CI artifacts that were already downloaded. Use when an explanation of a CI failure is wanted without changing code. Not for tests that fail when run locally."

All 5 reps: 1 ci ✅, 2 cli ✅, 3 cli ✅, 4 none ✅, 5 none ✅, 6 none ✅ (30/30).
Typical reason for 4: "fails locally, which investigate-ci-failure excludes, and playwright-cli alone isn't for fixing test files".

## 2026-11-12: three new skills (plan Task 7)

Same method: fresh `sonnet` subagents get only the 8 skill names and
descriptions, no tools, and pick one skill (or none) per request. 5 reps.

| # | Request | Right |
|---|---------|-------|
| 1 | Why did the Playwright job fail on main last night? | investigate-ci-failure |
| 2 | Open saucedemo and check the login button is visible | playwright-cli |
| 3 | Take a screenshot of the cart page | playwright-cli |
| 4 | The checkout-happy-path test fails when I run it locally | healing-playwright-tests |
| 5 | Write a test plan for the Swag Labs cart | planning-playwright-tests |
| 6 | Load-test the API | none |
| 7 | Set up a test framework for this new project | building-playwright-framework |
| 8 | Map how the tests in this repo are organised | mapping-existing-framework |
| 9 | We've never looked at this site before, investigate it | mapping-site-journeys |
| 10 | Write the test for scenario 2.1 | generating-playwright-tests |
| 11 | The cart test fails locally | healing-playwright-tests |
| 12 | Add our second app to the test framework | building-playwright-framework |

All 5 reps answered all 12 correctly (60/60). No description changes needed.
