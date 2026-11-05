# CI Failure Investigator: Design

Date: 2026-11-05
Status: Draft, awaiting approval

## Intent

When the Playwright tests fail in GitHub Actions, finding out why takes manual
work: open the run, download the report, read the trace, then open the site to
compare. The owner wants to hand that job to Claude.

Build a **Claude Code skill** that finds the most recent failed Playwright run
on `main`, downloads the artifacts from that run, investigates the failure with
Playwright CLI, and writes a **markdown report explaining why it failed**.

The same skill file must run **locally** (in Claude Code on the owner's
machine) and **on GitHub** (through the Claude GitHub Action, when someone
mentions `@claude`). It should give the same kind of result in both places.

This is a learning project (see `lessons learned/`), so clarity matters more
than cleverness.

## Goals

- One skill, one set of instructions, used in both places.
- Find the right run without the owner looking up an ID.
- Give Claude enough evidence (screenshots, traces, results) to find the cause.
- Produce a report a human can read in a couple of minutes.
- Scope: **UI test failures only** for now.

## Non-goals

- Changing application or test code. The skill only reads and reports.
- Opening PRs or proposing patches. ("We can PR and all that later.")
- Running automatically on every failure. For now, GitHub runs it only when
  someone asks with `@claude`.
- Investigating non-UI failures (see "Failure types").
- Supporting branches other than `main` for the automatic "latest failure"
  lookup.

## Anti-goals

- A report that sounds confident but has no evidence behind it. Every claim in
  the report should point to something Claude saw (an error line, a screenshot,
  a trace step, a page it opened).
- Different answers locally and on GitHub for the same run, caused by
  environment differences (headed vs headless, missing tools).
- Hardcoding a site. The tests currently target saucedemo.com, but the skill
  must not depend on that.

## What the owner decided

- **Form:** a skill under `.claude/skills/`.
- **Which run:** the latest failed run on `main`. If newer runs passed, look
  back for the latest failure. If `main` has never failed, say so and stop.
- **Run ID input:** the skill takes an optional run ID, so GitHub can pass the
  run that just failed. (Mine: the exact way the ID is passed is left to the
  builder.)
- **Output:** a markdown report only. Saved to
  `reports/ci-failure-<run-id>.md` in the repo. On GitHub it is also uploaded
  as a workflow artifact.
- **Artifacts:** change the Playwright config and workflow so failed runs also
  upload screenshots, traces and `test-results/`. Today only `playwright-report/`
  is uploaded, and traces are only recorded on retry.
- **Investigation:** read the failure and the trace, then use Playwright CLI,
  headless, against the live site to see what changed (selector, text, timing,
  data).
- **Failure types to explain:**
  1. **The UI changed.** The report says what changed.
  2. **The test is wrong.** The report says "this failed because the test does
     X but the UI does Y."
  3. **Neither** (install error, network outage, runner problem): the report
     names it in one line and stops. This third rule is the builder's
     reading of "UI failures only" and was not explicitly confirmed by the
     owner.
- **Site URL:** read from the tests and config, not hardcoded.
- **GitHub trigger:** only when asked with `@claude` (interactive mode in
  `claude.yml`).

## Constraints

- Existing setup (do not break):
  - `.github/workflows/playwright.yml` runs tests on push and PR to `main`,
    installs Chromium only, and uploads `playwright-report/` for 30 days.
  - `playwright.config.ts`: Chromium only, half the CPU cores as workers on CI,
    headless on CI, `retries: 1` on CI, `trace: 'on-first-retry'`.
  - `.github/workflows/claude.yml` has `actions: read` permission and the
    secret `CLAUDE_CODE_OAUTH_TOKEN`. By default Claude in the action has no
    arbitrary shell access; commands must be allowed with `--allowedTools` in
    `claude_args`.
  - `.claude/skills/playwright-cli/` already teaches Claude to use Playwright
    CLI.
- The skill needs `gh` (to list runs and download artifacts) and Playwright
  CLI. Locally these are already installed. On GitHub the workflow must make
  them available.
- Same behaviour in both places means the skill itself must not assume a
  logged-in desktop or a visible browser.

## Known facts that help

- Failed runs already exist in the repo for testing the skill, including
  "failed on purpose throwing error" on `main`, and the locked-out login test
  with a wrong password (fixed in PR #3). The second one is a good example of
  "the test is wrong."
- In automation mode the action writes results to the run log, not as a
  comment. In interactive mode (`@claude`), results appear as a comment on the
  issue or PR.

## Left to the builder

- Skill name and folder layout.
- How the run ID is passed in locally and from the workflow.
- The exact `gh` commands and how artifacts are downloaded and unpacked.
- Report structure, as long as it names the failing test(s), the failure type,
  the cause, and the evidence.
- Which `--allowedTools` the GitHub workflow needs for the skill.
- Whether the report is committed or only uploaded when run on GitHub.
- How to tell a "test is wrong" failure from a "UI changed" failure.

## Calls made while writing this (not yet agreed by the owner)

These came out of the builder check. They are the writer's decisions; the owner
can overrule any of them.

1. **"UI changed" vs "test is wrong".** The site under test is third-party, so
   the skill cannot see the UI "change" in git. It uses the failure's own
   evidence (error text, screenshot, trace) plus the live site now, and the git
   history of the test files between the last passing run and the failing one.
   The report says "mismatch" and states which side looks different from what
   the test expects. It only says "the UI changed" when a passing run or the
   test history supports it. If both could be true, the report says so.
2. **Flaky tests.** "Failed run" means the run's conclusion is failure. A test
   that failed once and passed on retry inside a *failed* run is listed in the
   report as flaky, apart from the hard failures. Runs that passed overall are
   out of scope.
3. **Live site differs or is unreachable.** The trace and screenshots from the
   failing run are the main evidence. The live site is a cross-check. If the
   site is down or looks different from the screenshots, the report says so and
   hedges instead of stopping.
4. **Explicit run ID.** The `main`-only rule applies to the default lookup. An
   explicit run ID is accepted from any branch, including PR runs.
5. **Delivering the report on GitHub.** The `@claude` job posts a short summary
   as its normal comment and uploads the full report as a workflow artifact.
   This needs an upload step added to `claude.yml`. The report is not committed
   on GitHub (no write access). Locally the file is written to `reports/` and
   not committed.
6. **Non-UI failures.** The skill checks the error text and the run log first.
   It exits early only on clear signs such as an install failure or no test
   results at all. Otherwise it investigates.

## Testing (decided by the owner)

The GitHub side is tested directly on this repo (`Ric-are-do/AgenticTesting`).
The repo was built for this purpose. That means:

- Changes to `claude.yml` and `playwright.yml` are merged to `main`, because
  `@claude` comments trigger the workflow from the default branch.
- The skill is tested against failed runs already in the history, and against
  new deliberate failures (like the earlier "failed on purpose" test) when
  needed.

## Open for the owner

Nothing. Approval of this document is the next step.

## Success looks like

- Running the skill locally against the current repo finds the latest failed
  `main` run, and writes `reports/ci-failure-<run-id>.md` that correctly
  explains the failure.
- Asking `@claude` on GitHub to run it produces the same kind of report as a
  workflow artifact.
- On a repo state where `main` never failed, it says so and exits cleanly.
- For a non-UI failure it reports that in one line.
