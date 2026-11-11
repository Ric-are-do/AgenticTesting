---
name: investigate-ci-failure
description: Use when Playwright tests failed in GitHub Actions or CI, such as "why did CI fail", "the Playwright job is red on main", a failed run ID or run link, or CI artifacts that were already downloaded. Use when an explanation of a CI failure is wanted without changing code. Not for tests that fail when run locally.
allowed-tools: Bash(bash .claude/skills/investigate-ci-failure/scripts/fetch-failure.sh:*) Bash(gh run:*) Bash(playwright-cli:*) Bash(git log:*) Bash(git diff:*) Bash(git show:*) Read Write Edit Glob Grep
---

# Investigate a CI failure

Write a report explaining why the UI tests failed. Do not change any code and do not open PRs.

Input (all optional):
- a run ID, or a directory of already-downloaded artifacts;
- `limit N`: investigate at most N hard failures (default 5);
- `head sha <sha>`, `branch <name>`: the commit and branch to report under `## Run`;
- `compare against <ref>`: the base for `git diff` (for example `origin/main` on a PR).

The report is written early and updated as you go, so a run that gets cut off still leaves a useful report.

## 1. Get the evidence

- If the user gave an artifacts directory, use it and skip the fetch. Read the run ID from the folder name if there is one, otherwise use `local`.
- Otherwise run `bash .claude/skills/investigate-ci-failure/scripts/fetch-failure.sh [--branch NAME] [RUN_ID]`.
  - By default it looks at `main`. Only if the user names a branch, pass `--branch <that branch>`. If the user gives a run ID, pass just the run ID.
  - Exit 3: say that the branch (`main` unless the user named another) has no failed runs and stop. Write no report.
  - Exit 4: there are no artifacts. Work from `<RUN_DIR>/failed.log` only.
  - Exit 0: artifacts are in `RUN_DIR` (`playwright-report/`, `test-results/`) with `failed.log` beside them.
- If the user gave `head sha` and `branch`, use those. Otherwise use the script's `HEAD_SHA` and `HEAD_BRANCH`, or `unknown` when you have neither.

## 2. Triage, then write the report skeleton

Read `test-results/results.json` and `failed.log` (either may be missing). Runs from before 2026-11-05 have no `test-results/` (no `results.json`, screenshots or traces): in that case work from `failed.log` and `playwright-report/`, and say in `## Evidence` which evidence was missing.

- If the failure is clearly infrastructure (dependency install error, browser download error, no test results at all), write the report with `## Failure type` as `Not a UI failure: <reason>`, `None` or `Not checked` under the other headings, and stop.
- Tests with status `flaky` (failed, then passed on retry) go under `## Flaky tests`. They are never investigated.
- Tests with status `unexpected` are the hard failures. Take them in the order they appear in `results.json`. The first N (the limit, default 5) will be investigated; the rest go under `## Not investigated`.

**Now, before investigating anything,** write `reports/ci-failure-<run-id>.md` (create `reports/`) with all the headings from step 6. Fill in `## Failing tests`, `## Not investigated`, `## Flaky tests` and `## Run`, and put `Investigation in progress` under every other heading.

## 3. Investigate each of the first N hard failures

For each one, in order:

1. Look in the test's folder under `test-results/` for `error-context.md` (Playwright writes it on every failure; `results.json` lists it as the `error-context` attachment). Read it first: it has the error and a text snapshot of the page at the moment the test failed. Use that snapshot as the main evidence of what the page showed. If it is missing, say so in `## Evidence` for that test and use the screenshot (`.png`) and trace instead.
2. Read the test source under `tests/`. If a head SHA is known and differs from `git rev-parse HEAD`, read the file as it was in that commit: `git show <head sha>:<path>`. If it does not exist, say so.
3. Find the site URL in the test or in `playwright.config.ts`. Never assume a site.
4. Use the `playwright-cli` skill, headless, to open that URL and walk to the failing step. Compare what you see with the snapshot or screenshot and with what the test expects. When `error-context.md` already explains the failure, keep this check short.
   - If the user says to treat the site as unreachable, do not open it.
   - If the site cannot be reached, or looks different from the snapshot or screenshot, say so and rely on the saved evidence.
5. **Update the report file**: add this test's part of `## Test vs UI`, `## Live site check` and `## Evidence`.

## 4. Check what changed

`git log` and `git diff` on the test files:
- if the user gave `compare against <ref>`: `git diff <ref>...<head sha>`;
- otherwise: between the last passing run's SHA (`gh run list`) and the head SHA.

Add what you found to `## Evidence`.

## 5. Decide the type

Pick one for `## Failure type`:

- `UI mismatch`: the page does not match what the test expects. Say "mismatch". Only say "the UI changed" when a passing run or test history supports it.
- `Test is wrong`: the test asserts or does something the UI never did. Explain it as "the test does X but the UI does Y".
- `Flaky`: only flaky tests, no hard failures.
- `Not a UI failure`: see step 2.

If both a UI mismatch and a wrong test could explain it, say so. If different failures have different types, give the type for each.

## 6. Finish the report

Fill in `## Summary` and `## Failure type`, and make sure no `Investigation in progress` is left. The headings, in this order, every time:

```
# CI failure report: run <run-id>
## Summary
## Failure type
## Failing tests
## Not investigated
## Test vs UI
## Flaky tests
## Live site check
## Evidence
## Run
```

- `## Not investigated`: hard failures beyond the limit, by name, or `None`.
- `## Flaky tests`: the flaky test names, or `None`.
- `## Live site check`: exactly one of `Reached`, `Unreachable`, or `Differs from screenshots`, then a short note.
- `## Evidence`: every claim above points to something you saw (an `error-context.md` snapshot, an error line, a screenshot, a trace step, a page you opened).
- `## Run`: run ID, commit SHA and branch.

When finished, tell the user the report path and give a two-line summary.
