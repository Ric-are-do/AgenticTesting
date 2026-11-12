# healing-playwright-tests: test log

Fixtures in `tests/_skill-tests/` (all fail before healing, 3 failed):
- `login-locked-out-copy.spec.ts`: a copy of the locked-out test with the
  login button locator broken to `#login-btn`, inside the test file.
- `helpers.ts`: a shared `LOGIN_BUTTON = '#login-btn'` and `login()`, used by
  `login-standard.spec.ts` and `login-problem.spec.ts`.

Prompt: "The tests in tests/_skill-tests are failing locally. Fix them. Do
not commit." Fresh `sonnet` general-purpose subagent.

## RED: no healing skill (2026-11-10)

- Root cause found correctly: `#login-btn` doesn't exist, so the click timed
  out.
- **Edited the shared helper** (`sed -i ... helpers.ts`). Its reason:
  "the two login specs ... pick up the fix through the helper". This is a
  framework change the tester must report, not make.
- **No live inspection.** It tried `curl` (got no markup because the page is
  rendered by JS), then copied `[data-test=login-button]` from other repo
  tests: "The selector fix rests on the failing run's snapshot and the other
  repo tests". The right locator, but by inference.
- Ran the tests with the normal command. Final: `3 passed (8.9s)`.
- No routing to investigate-ci-failure, no sleeps, no MCP calls.

## GREEN: skill text given as loaded (2026-11-10)

- Inspected the live page with playwright-cli and found
  `<input data-test="login-button" id="login-button" ...>`.
- Healed only `login-locked-out-copy.spec.ts`, with `[data-test=login-button]`.
- **Left `helpers.ts` unchanged** (sha1 `61334c80…` before and after). Under
  "Not changed (needs your OK)" it proposed
  `export const LOGIN_BUTTON = '[data-test=login-button]';` and named the two
  affected tests.
- Honest final run: `2 failed ... 1 passed (32.2s)`, with no flag changes,
  no fixme (correct, since the remaining failures have a known fix) and no
  MCP calls.

## Routing re-check with all 5 skills (Review Focus 2)

5 reps × 7 requests (the 6 from Task 1, plus "Write the test for scenario
1.1 in specs/swag-labs-critical-path.md"): **35/35 correct**.
1 → investigate-ci-failure, 2/3 → playwright-cli,
4 → healing-playwright-tests, 5 → planning-playwright-tests, 6 → none,
7 → generating-playwright-tests.

## 2026-11-12: fix shared code where it lives (plan Task 6)

Scratch copy of the standard Swag Labs framework with the login page object's
locator broken (`login-button` → `login-btn`). Prompt: "The Swag Labs tests
are failing, fix them."

### RED: old skill

Found the right cause (checked the live page) but **made no edit**: "the
broken locator is in a shared page object and the skill says to report that".
Final run `4 failed`.

### GREEN: new skill

✅ Same diagnosis, one-line fix in `apps/swag-labs/pages/login-page.ts`, specs
untouched, whole suite re-run and listed under "Framework changes", `4 passed`
(re-run by me: `4 passed (4.2s)`).
