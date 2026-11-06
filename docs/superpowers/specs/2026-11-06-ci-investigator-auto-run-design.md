# CI investigator: run automatically on failed test runs

Date: 2026-11-06
Builds on: `2026-11-05-ci-failure-investigator-design.md` (the `investigate-ci-failure` skill).

## Why

Today the investigator only runs when someone tags `@claude` and asks. A red run sits
there until a person notices it, asks, and waits. The goal is that every failed
Playwright run produces, by itself, a report of what Claude thinks went wrong, ready
to download from the same run page. Asking for an investigation by hand should keep
working, through the same investigator.

## What it does

When the Playwright test job fails, a second job in the same workflow run starts.
Claude reads that run's evidence, investigates the failures with the existing
`investigate-ci-failure` skill, and uploads the report as an artifact on that run.
A person reads the report. Claude changes no code, opens no PRs and posts no
comments.

The same investigator can also be started by commenting `@claude investigate` (with
an optional run ID) on an issue or PR.

## Goals

- Every failed Playwright run gets a report artifact automatically.
- The report appears on the same run page as `playwright-report` and `test-results`.
- A report always exists, even when Claude is cut off. **No report is the worst
  case.**
- Claude's effort and cost are capped per run.
- The investigation logic stays in one place: the skill, run by one reusable workflow.

## Non-goals

- Fixing tests or opening PRs.
- Posting the report as a PR comment or on the run's summary page (download only, for
  now).
- Investigating flaky tests.
- Running on PRs from forks.
- A shared or published GitHub Action for other repos.

## Anti-goals (would count as failure even if it works)

- A failed run with no report artifact.
- Claude running long or many times on one bad run (cost blow-up).
- The investigator job showing red next to the real test failure, or hiding it.
- The normal `@claude` job getting heavier or wider permissions because of the
  investigator.

## Decisions (agreed with the user)

1. **One reusable workflow, two callers.** All investigator setup lives in
   `.github/workflows/investigate-ci.yml` (`on: workflow_call`). It is called from:
   - `playwright.yml`: a job `investigate` with `needs: test`, run only if `test`
     failed (automatic path);
   - `claude.yml`: a job `investigate` run only when the comment contains
     `@claude investigate` (on-request path; the user's idea).
   Chosen over a step at the end of the test job (secrets and Claude permissions
   would sit in the test job) and over a separate `workflow_run` workflow (report
   lands on a different run page, only the default-branch copy runs, plus secrets
   and untrusted-checkout risk).
2. **Automatic path triggers:** every failed run of `playwright.yml` (push to `main`
   or `master`, PRs, manual runs). Not PRs from forks. (Including manual runs and
   `master` was Claude's call; the user approved it.)
3. **Flaky tests are skipped.** With `retries: 1`, a run where tests only flaked
   passes, so the job never starts. When a run has hard failures and flaky tests,
   the flaky tests are only listed in the report, as the skill does today.
4. **At most 5 hard failures investigated.** Failures beyond the first 5 are listed
   in the report as not investigated.
5. **Hard limits:** at most **50** Claude turns and a **15-minute** job timeout.
6. **Report is written as Claude goes**, so a partial report always exists (see
   Skill changes). If even that is missing, the job writes a fallback report (see
   below). The investigate job never shows as failed.
7. **Output:** `reports/ci-failure-<run-id>.md`, uploaded as artifact
   `ci-failure-report`. Download only.
8. **Slim down the normal `@claude` job.** Remove the investigator setup from the
   existing `claude` job (Node/`npm ci`, Chromium, Playwright CLI install, the
   investigator's allowed tools, the report upload). Keep `actions: read`,
   `additional_permissions: actions: read`, and `GH_TOKEN`/`GH_REPO` so `@claude`
   can still read CI results. Keep `--max-turns 30` for the normal job.
9. **What a run is compared against (Claude's call, approved):**
   - PR run: the report shows the PR head commit
     (`github.event.pull_request.head.sha`) and head branch, and "what changed" is
     the PR's diff against `main` (`git diff origin/main...<head sha>`), not GitHub's
     merge commit.
   - `main`/`master`/manual run: the commit tested (`github.sha`) and its branch,
     compared against the last passing run on that branch, as the skill does today.

## How it fits together

### `investigate-ci.yml` (`on: workflow_call`)

Inputs:
- `run_id` (required): the Playwright run to investigate.
- `same_run` (boolean): `true` when called from `playwright.yml` (artifacts are in
  this run), `false` when called from `claude.yml` (artifacts are in another run).
- `head_sha`, `head_branch`, `base_ref` (optional): what to report and compare
  against, per decision 9. When empty (on-request path), the fetch script's
  `HEAD_SHA`/`HEAD_BRANCH` are used.

One job, `timeout-minutes: 15`, permissions `contents: read` and `actions: read`.
Steps:

1. Check out with full history (`fetch-depth: 0`). The working tree stays on the workflow's own commit (so the skill and scripts exist); the skill reads the tested commit's files with `git show <sha>:<path>`.
2. Get the evidence into `.ci-failure/<run-id>/` (`test-results/`,
   `playwright-report/`, the layout the skill expects; the folder name gives the run
   ID):
   - `same_run: true`: `actions/download-artifact` for `test-results` and
     `playwright-report`.
   - `same_run: false`: `bash .claude/skills/investigate-ci-failure/scripts/fetch-failure.sh <run_id>`
     (or no run ID, see below).
3. Install Node, `npm ci`, Chromium and Playwright CLI (for the live site check).
4. Run the Claude Code CLI (`claude -p`, installed with `@anthropic-ai/claude-code`). Not `claude-code-action@v1`: it rejects `push` events (found in review). Step `timeout-minutes: 10`, so the fallback and upload always run inside the 15-minute job:
   - auth: `CLAUDE_CODE_OAUTH_TOKEN` (passed via `secrets: inherit`);
   - a fixed `prompt`: run the skill on the artifacts directory, at most 5 hard
     failures, with the head SHA, branch and comparison base from decision 9;
   - `--max-turns 50`;
   - allowed tools: `gh run`, `playwright-cli`, `git log`, `git diff`, Read, Write,
     Glob, Grep;
   - `GH_TOKEN` and `GH_REPO` set so `gh run` works;
   - `continue-on-error: true` on this step, so the cap or a Claude error never
     fails the job.
5. **Fallback report:** if `reports/ci-failure-<run-id>.md` does not exist, write
   one with the standard headings that says the investigation did not finish, why if
   known (turn limit, timeout, error), and points to `playwright-report`. Runs
   `if: always()`.
6. Upload `reports/` as artifact `ci-failure-report`, `if: always()`.

The job must end green. (`continue-on-error` cannot be set on a job that calls a
reusable workflow, so this is done at the step level inside `investigate-ci.yml`.)

### `playwright.yml`

- Existing job `test`, unchanged.
- New job `investigate`:
  - `needs: test`
  - `if: failure() && (github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository)`
  - `uses: ./.github/workflows/investigate-ci.yml` with `run_id: ${{ github.run_id }}`,
    `same_run: true`, head SHA, branch and base per decision 9; `secrets: inherit`.

### `claude.yml`

- Existing job `claude`: slimmed per decision 8, and skips comments that contain
  `@claude investigate` (so both jobs never run on the same comment).
- New job `investigate`:
  - runs on the same comment events, only when the body contains
    `@claude investigate`;
  - reads an optional run ID from the comment (the first number after
    `@claude investigate`); with none, the fetch script's default applies (latest
    failed run on `main`; on a PR, the latest failed run on the PR's branch);
  - calls `investigate-ci.yml` with `same_run: false`.
  - The report is an artifact on the `claude.yml` run.

## Skill changes (`investigate-ci-failure`)

- **Write the report as you go.** Write `reports/ci-failure-<run-id>.md` early with
  all headings, after triage (step 2): failing tests, flaky tests, not-investigated
  list, and `Investigation in progress` placeholders. Update the file after each
  failure is investigated. The final pass fills `## Summary` and
  `## Failure type`. A cut-off run then leaves a useful partial report.
- **Read `error-context.md` first.** Playwright writes it into each failed test's
  folder under `test-results/` on every failure (no config needed). It holds the
  error and a text (accessibility tree) snapshot of the page at the moment of
  failure. The skill reads it before the screenshot, trace or live site, and uses it
  as the main "what the page showed" evidence in `## Test vs UI` and `## Evidence`.
  It is cheaper in turns than an image or a browser session. The live site check
  stays, but when `error-context.md` already explains the failure, the check can be
  short.
- **Limit:** "investigate at most N hard failures (default 5)", which can be given in
  the request. The local default is also 5.
- New heading `## Not investigated`, after `## Failing tests`: hard failures beyond
  the limit, by name, or `None`.
- Accept a head SHA, branch and comparison base given in the request (decision 9),
  and use them for `## Run` and for `git diff`, instead of looking them up.
- Local use keeps working as it does now.

## Constraints

- Only Chromium is used, no test matrix.
- Do not commit, push or create branches as part of the build without asking the
  user first (user's standing rule).
- The test job's result must stay exactly what it is today.

## Left to the builder

- Exact prompt wording.
- How to handle a missing `failed.log` on the automatic path (the run is still in
  progress, so the run-level failed log may not exist yet). Working from
  `results.json` alone, or fetching the test job's log another way, are both fine.
- How to read the run ID out of the comment (a small shell step is fine).
- What the fetch script defaults to on a PR comment, if that needs a small change to
  pass `--branch`.
- `actions/*` versions: match the existing workflows unless there is a reason not to.
- How to test before merging (for example, a throwaway PR with a deliberately
  failing test, and an `@claude investigate` comment on it).
