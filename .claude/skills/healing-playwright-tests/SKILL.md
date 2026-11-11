---
name: healing-playwright-tests
description: Use when Playwright tests fail, time out, are flaky or broken when run locally, such as "this test is failing", "fix the failing tests", "locator not found", "Timeout exceeded" or "the test broke after a UI change". For failures in a GitHub Actions or CI run, use investigate-ci-failure instead.
---

# Healing Playwright tests

## Overview

Find the real cause of each failure, fix **only the test file**, and prove it
with a clean re-run. Fixes that belong in shared code are reported, not made.

## When to use

- Local `npx playwright test` failures: timeouts, missing locators, wrong
  expected text, flaky results.
- Not for CI runs (investigate-ci-failure) or writing new tests
  (generating-playwright-tests).

## Process

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
   | a helper, fixture, page object or config used by more than one test | **Don't edit it.** Report the exact change you'd make |
   | the app (a real bug) | Don't "fix" the test to pass. Report the bug |

5. **One fix at a time**, then re-run that test.
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
Marked fixme: <test> — <why>            (or "none")
Not changed (needs your OK): <file> — <proposed change> — <tests affected>
Final run: <summary line, quoted>
```

## Common mistakes

- Editing a shared helper because "every test picks up the fix". That's a
  framework change, so report it.
- Guessing a locator from other tests instead of looking at the page.
- Calling it healed while tests that depend on an unchanged helper still fail.
  List them under "Not changed".
