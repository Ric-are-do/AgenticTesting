---
name: healing-playwright-tests
description: Use when Playwright tests fail, time out, are flaky or broken when run locally, such as "this test is failing", "fix the failing tests", "locator not found", "Timeout exceeded" or "the test broke after a UI change". For failures in a GitHub Actions or CI run, use investigate-ci-failure instead.
---

# Healing Playwright tests

## Overview

Find the real cause of each failure, **fix it where it lives**, and prove it
with a clean re-run of everything that uses what you changed.

## When to use

- Local `npx playwright test` failures: timeouts, missing locators, wrong
  expected text, flaky results.
- Not for CI runs (investigate-ci-failure) or writing new tests
  (generating-playwright-tests).

## Process

0. **Read the framework map** (`framework-map.md` in the agent's memory): it
   says where locators, fixtures and helpers live. No map → go back to the
   agent's map check.
1. **Run** `npx playwright test "<path>"` with the project's normal settings.
   List every failing test. Read each full error and its
   `test-results/**/error-context.md`.
2. **Inspect the live page** for each failure (REQUIRED: the playwright-cli
   skill). Open the page where it failed, take a snapshot, and find the real
   element or text. Don't infer locators from other tests or from `curl`.
3. **Name the root cause:** a changed locator, a wrong expected value,
   timing, data, or the app actually broke.
4. **Decide where the fix lives:**

   | The broken thing is in... | Do |
   |---|---|
   | the failing `.spec.ts` itself | Fix it there |
   | a page object, component, fixture, helper or config | **Fix it there** (a locator lives in its page object). Then find every spec that uses it (`Grep`) |
   | the app (a real bug) | Don't "fix" the test to pass. Report the bug |

5. **One fix at a time**, then re-run that test, and after a shared fix,
   every spec that uses the changed file.
6. **Can't fix it, and you're confident the test is right?** Add
   `test.fixme()` with a comment before the failing step saying what happens
   instead. Never delete a test.
7. **Finish with a full re-run** of the path. Report what it printed, as is.

## Fix rules

- Prefer `data-test`, role or text locators. Use a regex for dynamic data.
- No `waitForTimeout`, `networkidle` or other deprecated waits.
- No new or changed run flags to force a green run.

## Report (required)

```
Healed: <test> — <root cause> — <fix>
Framework changes: <shared file> — <change> — <specs re-run>   (or "none")
Marked fixme: <test> — <why>            (or "none")
Final run: <summary line, quoted>
```

## Common mistakes

- Patching the spec (or adding a locator override in it) when the broken
  locator lives in a page object. Fix the page object.
- Re-running only the test you were asked about after a shared fix. Re-run
  every spec that uses the changed file.
- Guessing a locator from other tests instead of looking at the page.
