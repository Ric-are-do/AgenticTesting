# CI Failure Investigator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Claude Code skill that finds the latest failed Playwright run on `main`, downloads its artifacts, investigates with Playwright CLI, and writes a markdown report, running the same way locally and from `@claude` on GitHub.

**Architecture:** A bash script does the deterministic part (find the run, download artifacts and the failed log) so local and GitHub behave identically. A `SKILL.md` tells Claude how to classify the failure, investigate with `playwright-cli`, and write the report. The CI workflows are changed to produce richer artifacts and to let `@claude` run the skill and upload the report.

**Tech Stack:** bash, `gh` CLI, Playwright 1.64 (`@playwright/test`, `playwright-cli`), GitHub Actions, `anthropics/claude-code-action@v1`.

**Spec:** `docs/superpowers/specs/2026-11-05-ci-failure-investigator-design.md`

## Global Constraints

- Default lookup is the latest failed run on `main`; if newer runs passed, look back; if `main` never failed, say so and stop.
- An explicit run ID is accepted from any branch, including PR runs.
- The skill only reads and reports: no code changes, no PRs.
- Report path: `reports/ci-failure-<run-id>.md`. Not committed locally. On GitHub it is uploaded as a workflow artifact, never committed.
- Chromium only. Headless in both environments.
- The site URL is read from the tests and config, never hardcoded.
- UI failures only. Failures that are neither a UI mismatch nor a wrong test get a one-line report.
- On GitHub the skill runs only when asked with `@claude` (`claude.yml`).
- Report wording: say "mismatch". Say "the UI changed" only when a passing run or test history supports it.

## Review Focus

1. Explicit run ID from a PR branch must work (not only `main`). Pinned in Task 2.
2. A run with no downloadable artifacts must not crash; it exits 4 with the failed log saved. Pinned in Task 2.
3. The newest `main` run passed but an older one failed: the older failure must be found. Pinned in Task 2.
4. A test that failed then passed on retry inside a failed run appears under "Flaky tests", not as a hard failure. Pinned in Task 3.
5. Live site unreachable during the investigation: the report hedges and relies on trace and screenshots. Pinned in Task 3.

## File Structure

- Create `.claude/skills/investigate-ci-failure/scripts/fetch-failure.sh`: find run, download artifacts and failed log.
- Create `.claude/skills/investigate-ci-failure/scripts/fetch-failure.test.sh`: checks for the script against real run history.
- Create `.claude/skills/investigate-ci-failure/SKILL.md`: instructions and report format.
- Create `.claude/skills/investigate-ci-failure/fixtures/flaky/results.json`: fixture for the flaky case.
- Modify `playwright.config.ts`: richer artifacts.
- Modify `.github/workflows/playwright.yml`: upload `test-results/` as a second artifact.
- Modify `.github/workflows/claude.yml`: tools, setup, report upload.
- Modify `.gitignore`: ignore `/.ci-failure/` and `/reports/`.
- Modify `lessons learned/03-github-and-claude-setup.md`: record what was learned.

Known failed `main` runs usable as fixtures: `41894900615` ("failed on purpose throwing error"), `41892643912`, `41890473431`. A PR-branch run: `41891862700` (branch `add-claude-github-actions-1793818471215`). A run with no Playwright artifacts: `41895842655` (a Claude Code Review run). Artifacts expire after 30 days, so these work until early December 2026.

---

### Task 1: Richer failure artifacts

**Files:**
- Modify: `playwright.config.ts` (reporter and `use` block)
- Modify: `.github/workflows/playwright.yml` (add a second upload step)
- Modify: `.gitignore`

**Interfaces:**
- Produces: after a CI test run, `test-results/` contains `results.json` (Playwright JSON report), failure screenshots and `trace.zip` files. The workflow uploads it as artifact `test-results` alongside the existing `playwright-report`.

- [ ] **Step 1: Write the failing check.** Create a temporary `tests/tmp-fail.spec.ts` with one test named `tmp fails on purpose` that opens `https://www.saucedemo.com/` and expects the title `Nope`. Do not commit it.
- [ ] **Step 2: Run** `CI=1 npx playwright test tests/tmp-fail.spec.ts` then `ls test-results`. Expected now: no `results.json`, no `.png`, no `trace.zip`.
- [ ] **Step 3: In `playwright.config.ts`,** set `reporter: [['html'], ['json', { outputFile: 'test-results/results.json' }]]`, `use.screenshot: 'only-on-failure'` and `use.trace: 'retain-on-failure'` (replacing `'on-first-retry'`).
- [ ] **Step 4: Re-run the command from Step 2.** Expected: `test-results/results.json` exists, and the failing test's folder holds a `.png` and a `trace.zip`.
- [ ] **Step 5: In `playwright.yml`,** add a step after the existing upload using `actions/upload-artifact@v4`, `if: ${{ !cancelled() }}`, `name: test-results`, `path: test-results/`, `retention-days: 30`.
- [ ] **Step 6: Add `/.ci-failure/` and `/reports/` to `.gitignore`.** Delete `tests/tmp-fail.spec.ts`.
- [ ] **Step 7: Commit** `playwright.config.ts`, `playwright.yml`, `.gitignore` with message `ci: upload screenshots, traces and results.json on failure`.

### Task 2: `fetch-failure.sh`

**Files:**
- Create: `.claude/skills/investigate-ci-failure/scripts/fetch-failure.sh`
- Test: `.claude/skills/investigate-ci-failure/scripts/fetch-failure.test.sh`

**Interfaces:**
- Produces: `fetch-failure.sh [RUN_ID]`.
  - Env: `CI_WORKFLOW` (default `Playwright Tests`), `CI_BRANCH` (default `main`, used only when no `RUN_ID`).
  - Downloads all artifacts of the run into `.ci-failure/<run-id>/` and writes the failed log to `.ci-failure/<run-id>/failed.log`.
  - Prints `RUN_ID=`, `HEAD_SHA=`, `HEAD_BRANCH=`, `RUN_DIR=` lines on stdout.
  - Exit codes: `0` found and downloaded; `3` no failed run found; `4` run found but no artifacts downloadable (still prints the four lines and writes `failed.log`).
- Consumes: `gh` logged in (locally) or `GH_TOKEN` set (GitHub).

- [ ] **Step 1: Write `fetch-failure.test.sh`** with one function per case, each asserting exit code and output:
  - `default_finds_failed_main_run`: no args; exit 0, `HEAD_BRANCH=main`, and `RUN_ID` is one of the failed `main` run IDs from `gh run list --branch main --workflow "Playwright Tests" --status failure`.
  - `looks_back_past_passing_runs` (Review Focus 3): same call; `RUN_ID` differs from the newest `main` run's ID (`gh run list --branch main --limit 1`), as long as that newest run passed. Print SKIP if it did not.
  - `explicit_pr_run_id` (Review Focus 1): arg `41891862700`; exit 0, `HEAD_BRANCH=add-claude-github-actions-1793818471215`.
  - `no_failed_run_exits_3`: `CI_WORKFLOW="No Such Workflow"`; exit 3.
  - `no_artifacts_exits_4` (Review Focus 2): arg `41895842655`; exit 4, output has `RUN_ID=41895842655`, and `.ci-failure/41895842655/failed.log` exists.
  - `downloads_report_and_results`: arg `41894900615`; `.ci-failure/41894900615/playwright-report` exists.
- [ ] **Step 2: Run** `bash .claude/skills/investigate-ci-failure/scripts/fetch-failure.test.sh`. Expected: every case FAIL (script missing).
- [ ] **Step 3: Implement `fetch-failure.sh`.** Use `gh run list --json databaseId,headSha,headBranch` to find the run (or `gh run view <id> --json` for an explicit ID), `gh run download` for artifacts, `gh run view --log-failed` for the log. `set -euo pipefail`; errors go to stderr; do not delete existing `.ci-failure/<run-id>/` contents, overwrite them.
- [ ] **Step 4: Re-run the test script.** Expected: all PASS (or SKIP for `looks_back_past_passing_runs` only if the newest `main` run failed).
- [ ] **Step 5: Commit** both scripts with message `feat: add fetch-failure script for the CI investigator skill`.

### Task 3: The skill

**Files:**
- Create: `.claude/skills/investigate-ci-failure/SKILL.md`
- Create: `.claude/skills/investigate-ci-failure/fixtures/flaky/results.json`

**Interfaces:**
- Consumes: Task 2's script, its exit codes (0, 3, 4) and `RUN_DIR`.
- Produces: `/investigate-ci-failure [RUN_ID | artifacts directory]`. Writes `reports/ci-failure-<run-id>.md` with these headings in order: `## Summary`, `## Failure type` (one of `UI mismatch`, `Test is wrong`, `Flaky`, `Not a UI failure`), `## Failing tests`, `## Test vs UI` ("the test does X but the UI does Y"), `## Flaky tests` (`None` when empty), `## Live site check` (`Reached` / `Unreachable` / `Differs from screenshots`), `## Evidence`, `## Run` (ID, SHA, branch).

- [ ] **Step 1: Write the fixture** `fixtures/flaky/results.json`: a minimal Playwright JSON result with one test whose `status` is `"flaky"` (first attempt failed, retry passed) and one with `"unexpected"`. Use a made-up test title `fixture flaky login`.
- [ ] **Step 2: Write `SKILL.md`.** Frontmatter: `name: investigate-ci-failure`, a `description` that says when to use it, `allowed-tools: Bash(bash .claude/skills/investigate-ci-failure/scripts/fetch-failure.sh:*) Bash(gh run:*) Bash(playwright-cli:*) Bash(git log:*) Bash(git diff:*) Read Write Glob Grep`. Body steps, in order:
  1. If the user gave an artifacts directory, skip the fetch and use it. Otherwise run the script (with the run ID if given). On exit 3 say `main` has no failed runs and stop. On exit 4 report from `failed.log` only.
  2. Read `results.json` and `failed.log`. If the failure is clearly infrastructure (install error, no test results at all), write a one-line `Not a UI failure` report and stop.
  3. List flaky tests (status `flaky`) separately from hard failures.
  4. For each hard failure read the error, screenshot and trace, and the test source; get the site URL from the test or config.
  5. Use the `playwright-cli` skill, headless, to open the live site and check the failing step. If the site is unreachable or looks different from the screenshots, say so and rely on trace and screenshots (Review Focus 5).
  6. Decide the type using the Global Constraints wording rule; use `git log`/`git diff` on the test files between the last passing run's SHA and the failing SHA.
  7. Write the report with the headings above. Every claim cites evidence. Do not edit code.
- [ ] **Step 3: Check the "none found" path.** Run the skill with `CI_WORKFLOW="No Such Workflow"` set. Expected: no report file; Claude says `main` has no failed runs.
- [ ] **Step 4: Check against a real failure.** Run `/investigate-ci-failure 41894900615`. Expected: `reports/ci-failure-41894900615.md` exists with all eight headings, names the failing test, gives a type, and ends with the `## Run` section. Read the report yourself and confirm its cause matches the failed log.
- [ ] **Step 5: Check the flaky fixture** (Review Focus 4). Run the skill on `.claude/skills/investigate-ci-failure/fixtures/flaky`. Expected: `fixture flaky login` appears under `## Flaky tests`, not under `## Failing tests`.
- [ ] **Step 6: Check the unreachable site** (Review Focus 5). Run the skill on run `41894900615` and tell it to treat the live site as unreachable. Expected: `## Live site check` says `Unreachable` and the report still gives a cause from the trace or screenshots.
- [ ] **Step 7: Commit** the skill folder (not `reports/`, which is ignored) with message `feat: add investigate-ci-failure skill`.

### Task 4: Run the skill from GitHub with `@claude`

**Files:**
- Modify: `.github/workflows/claude.yml`

**Interfaces:**
- Consumes: Task 3's skill; Task 1's artifacts.
- Produces: an `@claude` request to run the skill leaves a short summary comment and an artifact named `ci-failure-report` containing `reports/`.

- [ ] **Step 1: Confirm a project skill can run in the action (spike).** Before other edits, open an issue on the repo with the title `@claude run the investigate-ci-failure skill on run 41894900615` after Tasks 1 to 3 are on `main` (ask the owner before pushing). Expected: the run starts. If Claude cannot find the skill, stop and bring that back to the owner, because the design depends on it.
- [ ] **Step 2: In `claude.yml`, before the Claude step,** add `actions/setup-node@v4` (`node-version: lts/*`), `npm ci`, `npx playwright install chromium`, and `npm install -g @playwright/cli@latest`.
- [ ] **Step 3: On the Claude step,** add `env: GH_TOKEN: ${{ github.token }}` and under `with:` add `claude_args: --max-turns 30 --allowedTools "Bash(bash .claude/skills/investigate-ci-failure/scripts/fetch-failure.sh:*),Bash(gh run:*),Bash(playwright-cli:*),Bash(git log:*),Bash(git diff:*)"`.
- [ ] **Step 4: After the Claude step,** add an `actions/upload-artifact@v4` step with `if: always()`, `name: ci-failure-report`, `path: reports/`, `if-no-files-found: ignore`.
- [ ] **Step 5: Ask the owner before pushing to `main`,** then push. Open a new issue titled `@claude run investigate-ci-failure on run 41894900615`.
- [ ] **Step 6: Verify.** `gh run list --workflow "Claude Code" --limit 1` shows `success`. `gh api repos/Ric-are-do/AgenticTesting/actions/runs/<id>/artifacts --jq '.artifacts[].name'` includes `ci-failure-report`. `gh issue view <number> --comments` shows Claude's summary comment. Download the artifact and confirm the report matches the one from Task 3 Step 4 in type and cause.
- [ ] **Step 7: Commit** `claude.yml` with message `ci: let @claude run the investigate-ci-failure skill`.

### Task 5: Record what was learned

**Files:**
- Modify: `lessons learned/03-github-and-claude-setup.md`

- [ ] **Step 1: Add a section** "Investigating CI failures with a skill" covering: what the skill does, how to run it locally (`/investigate-ci-failure [run-id]`) and from GitHub (`@claude`), where the report goes, and any lessons from Tasks 1 to 4 (especially anything the spike in Task 4 Step 1 showed).
- [ ] **Step 2: Commit** with message `docs: note the CI failure investigator`.

---

## Self-review

- **Spec coverage:** skill form, latest-failed-on-main with look-back, explicit run ID, report path, artifact changes, Playwright CLI investigation, three failure types, flaky handling, unreachable site, no hardcoded URL, `@claude`-only trigger, workflow artifact upload, and testing on this repo are each covered by a task above.
- **Type consistency:** the script's four output lines and exit codes (0, 3, 4) are used the same way in Tasks 2, 3 and 4. The report headings are defined once in Task 3.
- **Proportion:** five tasks; the only code bodies are config values, the script's interface and the workflow arguments.
