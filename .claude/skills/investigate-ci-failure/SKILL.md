---
name: investigate-ci-failure
description: Investigate why the Playwright tests failed in GitHub Actions. Finds the latest failed run on main (or a run ID you give), downloads its artifacts, checks the failure with Playwright CLI, and writes a markdown report. Use when asked to investigate, explain or debug a CI failure. Read-only: it never changes code.
allowed-tools: Bash(bash .claude/skills/investigate-ci-failure/scripts/fetch-failure.sh:*) Bash(gh run:*) Bash(playwright-cli:*) Bash(git log:*) Bash(git diff:*) Read Write Glob Grep
---

# Investigate a CI failure

Write a report explaining why the UI tests failed. Do not change any code and do not open PRs.

Input (optional): a run ID, or a directory of already-downloaded artifacts.

## 1. Get the evidence

- If the user gave an artifacts directory, use it and skip the fetch. Read the run ID from the folder name if there is one, otherwise use `local`.
- Otherwise run `bash .claude/skills/investigate-ci-failure/scripts/fetch-failure.sh [RUN_ID]`.
  - Exit 3: say that `main` has no failed runs and stop. Write no report.
  - Exit 4: there are no artifacts. Work from `<RUN_DIR>/failed.log` only.
  - Exit 0: artifacts are in `RUN_DIR` (`playwright-report/`, `test-results/`) with `failed.log` beside them.

## 2. Triage

Read `test-results/results.json` and `failed.log`. Runs from before 2026-11-05 have no `test-results/` (no `results.json`, screenshots or traces): in that case work from `failed.log` and `playwright-report/`, and say in `## Evidence` which evidence was missing.

- If the failure is clearly infrastructure (dependency install error, browser download error, no test results at all), write a one-line report under `## Failure type` as `Not a UI failure: <reason>` and stop.
- Tests with status `flaky` (failed, then passed on retry) go under `## Flaky tests`. Tests with status `unexpected` are the hard failures.

## 3. Investigate each hard failure

1. Read the error, the failure screenshot (`.png`), and the test source under `tests/`.
2. Find the site URL in the test or in `playwright.config.ts`. Never assume a site.
3. Use the `playwright-cli` skill, headless, to open that URL and walk to the failing step. Compare what you see with the screenshot and with what the test expects.
   - If the user says to treat the site as unreachable, do not open it.
   - If the site cannot be reached, or looks different from the screenshot, say so and rely on the trace and screenshots.
4. Check what changed in the tests: `git log` and `git diff` on the test files between the last passing run's SHA and the failing `HEAD_SHA`.

## 4. Decide the type

Pick one for `## Failure type`:

- `UI mismatch`: the page does not match what the test expects. Say "mismatch". Only say "the UI changed" when a passing run or test history supports it.
- `Test is wrong`: the test asserts or does something the UI never did. Explain it as "the test does X but the UI does Y".
- `Flaky`: only flaky tests, no hard failures.
- `Not a UI failure`: see step 2.

If both a UI mismatch and a wrong test could explain it, say so.

## 5. Write the report

Save to `reports/ci-failure-<run-id>.md` (create `reports/`). Use these headings, in this order, every time:

```
# CI failure report: run <run-id>
## Summary
## Failure type
## Failing tests
## Test vs UI
## Flaky tests
## Live site check
## Evidence
## Run
```

- `## Flaky tests`: the flaky test names, or `None`.
- `## Live site check`: exactly one of `Reached`, `Unreachable`, or `Differs from screenshots`, then a short note.
- `## Evidence`: every claim above points to something you saw (an error line, a screenshot, a trace step, a page you opened).
- `## Run`: run ID, commit SHA and branch.

When finished, tell the user the report path and give a two-line summary.
