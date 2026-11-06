# CI Investigator Auto-Run Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every failed Playwright run gets a `ci-failure-report` artifact automatically, and `@claude investigate [run-id]` runs the same investigator on request.

**Architecture:** One reusable workflow, `investigate-ci.yml` (`on: workflow_call`), holds all the investigator setup: it gets the evidence, runs the `investigate-ci-failure` skill through `claude-code-action`, writes a fallback report if none exists, and uploads `reports/`. `playwright.yml` calls it as a second job when `test` fails (same run, `same_run: true`). `claude.yml` calls it when a comment contains `@claude investigate` (`same_run: false`, evidence via the existing fetch script). The skill is changed to write its report as it goes, read `error-context.md` first, and cap the work at 5 hard failures.

**Tech Stack:** GitHub Actions (reusable workflows), `anthropics/claude-code-action@v1`, `actions/*@v4`, bash, `gh` CLI, Playwright 1.64.1, `@playwright/cli`.

**Spec:** `docs/superpowers/specs/2026-11-06-ci-investigator-auto-run-design.md`

## Global Constraints

- **Never `git add`, `git commit`, `git push`, or create or switch branches without asking the user first, every time.** Where a task ends, stop and tell the user what is ready plus a proposed commit message.
- At most 5 hard failures investigated; the rest go under `## Not investigated`.
- `--max-turns 50` for the investigator; `timeout-minutes: 15` on its job. The normal `@claude` job keeps `--max-turns 30`.
- Report path `reports/ci-failure-<run-id>.md`; artifact name `ci-failure-report`; download only (no PR comments, no step summary).
- The investigate job must always end green; a failed run must always have a report artifact.
- Flaky tests are listed, never investigated.
- Skip PRs from forks.
- Trigger phrase: `@claude investigate`, optionally followed by a run ID.
- PR runs: report the PR head SHA and head branch, compare with `origin/main...<head sha>`. Other runs: `github.sha`, its branch, compared against the last passing run on that branch.
- Chromium only. Match existing `actions/*@v4` and `claude-code-action@v1` versions. Auth via `secrets.CLAUDE_CODE_OAUTH_TOKEN`.

## Review Focus

1. **Claude cut off (turn limit, timeout, error) before writing any report** → the fallback report is uploaded and the job is green. Pinned in Task 2 (script test) and Task 3 Step 6.
2. **Infrastructure failure in the test job (e.g. `npm ci` failed, so no `test-results` artifact)** → evidence download fails without failing the job; Claude reports `Not a UI failure` or the fallback report says so. Pinned in Task 3 Step 6.
3. **`@claude investigate` when there is no failed run (fetch script exit 3)** → fallback report "No failed run found", job green, Claude not started. Pinned in Task 2 and Task 5 Step 6.
4. **More than 5 hard failures** → exactly 5 investigated, the 6th listed under `## Not investigated`. Pinned in Task 1 Step 4.
5. **A failure with no `error-context.md` (older runs, or a crash before any page)** → the skill falls back to screenshot, trace and log, and says in `## Evidence` that it was missing. Pinned in Task 1 Step 5.

## File Structure

- Modify `.claude/skills/investigate-ci-failure/SKILL.md`: write-as-you-go, error-context first, limit, `## Not investigated`, accept head SHA / branch / base.
- Create `.claude/skills/investigate-ci-failure/fixtures/many-failures/`: 6 hard failures + 1 flaky, with `error-context.md` for some.
- Create `.claude/skills/investigate-ci-failure/scripts/write-fallback-report.sh`: writes the fallback report only if none exists.
- Create `.claude/skills/investigate-ci-failure/scripts/write-fallback-report.test.sh`.
- Create `.github/workflows/investigate-ci.yml`: the reusable investigator.
- Modify `.github/workflows/playwright.yml`: add job `investigate`.
- Modify `.github/workflows/claude.yml`: slim the `claude` job, add `parse` + `investigate` jobs.

---

### Task 1: Skill changes

**Files:**
- Modify: `.claude/skills/investigate-ci-failure/SKILL.md`
- Create: `.claude/skills/investigate-ci-failure/fixtures/many-failures/test-results/results.json`
- Create: `.claude/skills/investigate-ci-failure/fixtures/many-failures/test-results/<test-folder>/error-context.md` (for failures 1–4 only)

**Interfaces:**
- Produces: the skill accepts, in the request, `limit N` (default 5), and optionally `head sha <sha>`, `branch <name>`, `compare against <ref>`. Report headings, in order: `## Summary`, `## Failure type`, `## Failing tests`, `## Not investigated`, `## Test vs UI`, `## Flaky tests`, `## Live site check`, `## Evidence`, `## Run`. Placeholder text while in progress: `Investigation in progress`.

- [ ] **Step 1: Write the fixture.** `results.json` in the same shape as `fixtures/flaky/results.json`: six specs `fixture hard failure 1` … `6` with status `unexpected` (each `error.message` different, e.g. a `toHaveURL` mismatch, a `toHaveText` mismatch, a locator timeout), plus `fixture flaky checkout` with status `flaky`. Use site `https://www.saucedemo.com/` in messages. For failures 1–4, add an `error-context.md` in each test's folder with a `# Page snapshot` section containing a short aria snapshot that explains the error (e.g. heading `Swag Labs`, an error `Epic sadface: ...`). Failures 5–6 have no `error-context.md`.
- [ ] **Step 2: Run the current skill on it to see it fail.** `claude -p "/investigate-ci-failure .claude/skills/investigate-ci-failure/fixtures/many-failures, treat the site as unreachable"`. Expected now: no `## Not investigated` heading, all six investigated or inconsistent.
- [ ] **Step 3: Edit `SKILL.md`.**
  - Step 2 (Triage) ends with: write `reports/ci-failure-<run-id>.md` now, with all nine headings; fill `## Failing tests`, `## Not investigated`, `## Flaky tests`, `## Run`; put `Investigation in progress` under the rest.
  - New rule: investigate at most N hard failures (default 5, or the `limit` given) in the order they appear in `results.json`; list the rest under `## Not investigated`, or `None`.
  - Step 3, item 1 becomes: read `error-context.md` in the test's folder first if it exists; use its page snapshot as the main "what the page showed" evidence; then the screenshot and trace only if needed. If it is missing, say so in `## Evidence`.
  - Step 3, item 3: the live site check may be short when `error-context.md` already explains the failure.
  - After each failure: update that failure's parts of `## Test vs UI`, `## Live site check` and `## Evidence` in the file.
  - Step 4 / report: if the request gives `head sha`, `branch`, `compare against`, use them for `## Run` and for `git diff <compare against>...<head sha>` instead of looking them up.
  - Step 5 becomes "Finish the report": fill `## Summary` and `## Failure type`, replace any leftover placeholder.
- [ ] **Step 4: Check the limit** (Review Focus 4). Re-run the Step 2 command. Expected: report has all nine headings in order; failures 1–5 are under `## Failing tests` with analysis; `fixture hard failure 6` is under `## Not investigated`; `fixture flaky checkout` under `## Flaky tests` only.
- [ ] **Step 5: Check error-context use** (Review Focus 5). In the same report: `## Evidence` cites `error-context.md` for failures 1–4 and says it was missing for failure 5.
- [ ] **Step 6: Check write-as-you-go.** Run `claude -p --max-turns 8 "/investigate-ci-failure .claude/skills/investigate-ci-failure/fixtures/many-failures, treat the site as unreachable"` after deleting the previous report. Expected: the report file exists, has all nine headings, and still contains `Investigation in progress` somewhere (cut off mid-way).
- [ ] **Step 7: Check nothing regressed.** `/investigate-ci-failure 41894900615` gives the same type and cause as `reports/ci-failure-41894900615.md` (Test is wrong; wrong password).
- [ ] **Step 8: Stop and ask.** Tell the user Task 1 is ready; proposed message `feat(skill): write report as it goes, read error-context, cap at 5`.

### Task 2: Fallback report script

**Files:**
- Create: `.claude/skills/investigate-ci-failure/scripts/write-fallback-report.sh`
- Create: `.claude/skills/investigate-ci-failure/scripts/write-fallback-report.test.sh`

**Interfaces:**
- Produces: `write-fallback-report.sh <run-id> <reason>`. If `reports/ci-failure-<run-id>.md` exists, does nothing and exits 0. Otherwise creates `reports/` and writes the report with all nine headings from Task 1; `## Summary` = `Investigation did not finish: <reason>. See the playwright-report artifact.`; `## Failure type` = `Not investigated`; other headings `None` or `Not checked`; `## Run` = the run ID. Always exits 0.

- [ ] **Step 1: Write the test** `write-fallback-report.test.sh`, same PASS/FAIL style as `fetch-failure.test.sh`, working in a temp dir (`cd "$(mktemp -d)"`):
  - `writes_when_missing`: run with `123 "turn limit reached"`; file `reports/ci-failure-123.md` exists, contains `Investigation did not finish: turn limit reached`, and its `## ` lines equal the nine headings in order.
  - `keeps_existing_report`: create `reports/ci-failure-456.md` with `real report`; run with `456 x`; file content is still exactly `real report`.
  - `exits_zero_always`: both runs exit 0.
- [ ] **Step 2: Run** `bash .claude/skills/investigate-ci-failure/scripts/write-fallback-report.test.sh`. Expected: FAIL (script missing).
- [ ] **Step 3: Write the script** (`set -euo pipefail`, heredoc for the report).
- [ ] **Step 4: Run the test.** Expected: `ALL PASSED`.
- [ ] **Step 5: Stop and ask.** Proposed message `feat(skill): add fallback report script`.

### Task 3: Reusable workflow `investigate-ci.yml`

**Files:**
- Create: `.github/workflows/investigate-ci.yml`

**Interfaces:**
- Consumes: Task 1 skill request format; Task 2 script; `fetch-failure.sh` stdout (`RUN_ID=`, `HEAD_SHA=`, `HEAD_BRANCH=`, `RUN_DIR=`) and exit codes (0, 3, 4).
- Produces: `on: workflow_call` with inputs (all `type: string` unless noted): `run_id` (default `''`), `same_run` (`type: boolean`, default `false`), `head_sha`, `head_branch`, `base_ref`, `branch` (for the fetch script's `--branch`; default `''`). Secret used: `CLAUDE_CODE_OAUTH_TOKEN` (callers pass `secrets: inherit`). One job `investigate`, `runs-on: ubuntu-latest`, `timeout-minutes: 15`, permissions `contents: read`, `actions: read`, `id-token: write`.

- [ ] **Step 1: Write the job steps, in order:**
  1. `actions/checkout@v4`, `fetch-depth: 0`.
  2. **Evidence, same run** (`if: inputs.same_run`): two `actions/download-artifact@v4` steps, names `test-results` and `playwright-report`, paths `.ci-failure/${{ inputs.run_id }}/test-results` and `.../playwright-report`, each `continue-on-error: true`. Then a step that sets outputs `run_id`, `head_sha`, `head_branch` from the inputs.
  3. **Evidence, other run** (`if: !inputs.same_run`), id `fetch`: runs `fetch-failure.sh` with `--branch` if `inputs.branch` set and `inputs.run_id` if set, with `GH_TOKEN: ${{ github.token }}`, `GH_REPO: ${{ github.repository }}`. Copies its `KEY=value` lines into `$GITHUB_OUTPUT` (lower-case keys) and also writes `exit_code`. Never fails the step (capture the exit code).
  4. A step `ids` that resolves the final `run_id`, `head_sha`, `head_branch`, `base_ref` from whichever evidence step ran (fetch outputs win when `same_run` is false; `base_ref` comes from the input).
  5. If `head_sha` is set and differs from the checkout, `git checkout <head_sha>`.
  6. Node (`actions/setup-node@v4`, `lts/*`), `npm ci`, `npx playwright install chromium`, `npm install -g @playwright/cli@latest`. Skip all four when fetch exit code is 3.
  7. `anthropics/claude-code-action@v1`, `continue-on-error: true`, skipped when fetch exit code is 3, `env` `GH_TOKEN`/`GH_REPO`, `with`:
     - `claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}`
     - `prompt`: `/investigate-ci-failure .ci-failure/<run_id>, limit 5, head sha <head_sha>, branch <head_branch>` plus `, compare against <base_ref>` when set.
     - `claude_args`: `--max-turns 50 --allowedTools "Bash(gh run:*),Bash(playwright-cli:*),Bash(git log:*),Bash(git diff:*),Read,Write,Glob,Grep"`
     - `additional_permissions: actions: read`
  8. Fallback (`if: always()`): `write-fallback-report.sh <run_id or "none"> <reason>`; reason is `No failed run found` when fetch exit code is 3, `the Claude step <outcome>` when the Claude step's `outcome` is not `success`, otherwise `unknown`.
  9. `actions/upload-artifact@v4`, `if: always()`, `name: ci-failure-report`, `path: reports/`.
- [ ] **Step 2: Lint.** `npx --yes actionlint@latest .github/workflows/investigate-ci.yml` — if that package is not available, use `docker run --rm -v "$PWD:/repo" -w /repo rhysd/actionlint:latest`; if neither works, tell the user and skip. Expected: no errors.
- [ ] **Step 3: Stop and ask.** Real verification needs Tasks 4–5 pushed to a branch; tell the user and propose message `ci: add reusable investigate-ci workflow`.
- [ ] **Step 4 (after Task 4 is on a test branch, with the user's OK): Check same-run path** — see Task 4 Step 4.
- [ ] **Step 5: Check the cut-off path** (Review Focus 1). On the test branch, temporarily set `--max-turns 3`. Expected: the run's `ci-failure-report` artifact contains a report (partial or fallback); the `investigate` job is green. Revert to 50.
- [ ] **Step 6: Check infrastructure failure** (Review Focus 2). On the test branch, temporarily break `npm ci` in the test job (e.g. `run: npm ci --no-such-flag && false`). Expected: `investigate` runs, is green, artifact has a report saying `Not a UI failure` or the fallback reason. Revert.

### Task 4: Call it from `playwright.yml`

**Files:**
- Modify: `.github/workflows/playwright.yml`

**Interfaces:**
- Consumes: Task 3 inputs.

- [ ] **Step 1: Add job `investigate`:** `needs: test`; `if: failure() && (github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository)`; `permissions: contents: read, actions: read, id-token: write`; `uses: ./.github/workflows/investigate-ci.yml`; `secrets: inherit`; `with`: `run_id: ${{ github.run_id }}`, `same_run: true`, `head_sha: ${{ github.event.pull_request.head.sha || github.sha }}`, `head_branch: ${{ github.head_ref || github.ref_name }}`, `base_ref: ${{ github.event_name == 'pull_request' && 'origin/main' || '' }}`.
- [ ] **Step 2: Lint** as in Task 3 Step 2.
- [ ] **Step 3: Ask the user** for OK to create a test branch, push, and open a throwaway PR with a deliberately failing test (e.g. temp `tests/tmp-fail.spec.ts` expecting title `Nope` on saucedemo).
- [ ] **Step 4: Verify** (with OK). `gh run view <run-id>` shows `test` failed and `investigate` succeeded; `gh api repos/Ric-are-do/AgenticTesting/actions/runs/<run-id>/artifacts --jq '.artifacts[].name'` includes `ci-failure-report`; downloaded report names `tmp fails on purpose`, `## Run` shows the PR head SHA and branch, `## Evidence` cites `error-context.md`.
- [ ] **Step 5: Verify flaky skip.** Confirm from the earlier green runs (or a temp test that fails only on retry 0, using `testInfo.retry`) that a flaky-only run has no `investigate` job run (`skipped`).
- [ ] **Step 6: Stop and ask.** Proposed message `ci: investigate failed Playwright runs automatically`.

### Task 5: `@claude investigate` in `claude.yml`

**Files:**
- Modify: `.github/workflows/claude.yml`

**Interfaces:**
- Consumes: Task 3 inputs (`same_run: false`, `run_id`, `branch`).

- [ ] **Step 1: Slim the `claude` job.** Remove setup-node, `npm ci`, Chromium, Playwright CLI install, the report upload step, and from `--allowedTools` the fetch script, `gh run`, `playwright-cli`, `git log`, `git diff` entries (keep `mcp__github_inline_comment__create_inline_comment`). Keep `--max-turns 30`, `GH_TOKEN`/`GH_REPO`, `actions: read`, `additional_permissions`. Add `&& !contains(<the comment/review/issue body>, '@claude investigate')` to each branch of its `if:`.
- [ ] **Step 2: Add job `parse`:** runs when the comment or issue body contains `@claude investigate` (same four event branches); `permissions: pull-requests: read, contents: read`; outputs `run_id` (first run of digits after `@claude investigate` in the body, else empty) and `branch` (the PR's `headRefName` via `gh pr view <number> --json headRefName` when the comment is on a PR, else empty). Pass the body via `env`, never inline `${{ }}` in the script (injection).
- [ ] **Step 3: Add job `investigate`:** `needs: parse`; `permissions: contents: read, actions: read, id-token: write`; `uses: ./.github/workflows/investigate-ci.yml`; `secrets: inherit`; `with: run_id: ${{ needs.parse.outputs.run_id }}`, `branch: ${{ needs.parse.outputs.branch }}`, `same_run: false`.
- [ ] **Step 4: Lint** as in Task 3 Step 2.
- [ ] **Step 5: Verify (on the test branch's PR, with the user's OK; note `issue_comment` workflows run from the default branch, so this check needs the change on `main` — ask the user before merging).** Comment `@claude investigate 41894900615`. Expected: only `parse` and `investigate` run (the `claude` job is skipped); artifact `ci-failure-report` has `reports/ci-failure-41894900615.md` with type `Test is wrong`.
- [ ] **Step 6: Check no failed run** (Review Focus 3). Comment `@claude investigate` on an issue when the latest `main` runs have no failure inside the fetch script's window — or simulate by setting `CI_WORKFLOW: No Such Workflow` temporarily on the fetch step. Expected: green job, fallback report says `No failed run found`.
- [ ] **Step 7: Check a normal `@claude`** comment still works without the investigator setup (e.g. `@claude what does playwright.config.ts retry on CI?`). Expected: `claude` job runs; `parse`/`investigate` skipped.
- [ ] **Step 8: Stop and ask.** Proposed message `ci: route @claude investigate to the reusable investigator`.

---

## Self-review

- **Spec coverage:** reusable workflow + two callers (Tasks 3–5); triggers incl. manual/master, fork skip (Task 4); flaky skip (Task 4 Step 5); limit 5 and `## Not investigated` (Task 1); 50 turns / 15 min (Task 3); write-as-you-go (Task 1) + fallback (Tasks 2–3); never red (Task 3 `continue-on-error`, fallback `always()`); download-only artifact (Task 3); slim `claude.yml` keeping CI-read permissions (Task 5); decision 9 comparisons (Task 1 Step 3, Task 4 Step 1); `error-context.md` first (Task 1). `failed.log` missing on the same-run path is left to the builder: the skill already works from `results.json`.
- **Consistency:** the nine headings are defined once (Task 1) and reused by Task 2; Task 3's inputs are the ones Tasks 4–5 pass.
- **Proportion:** no workflow bodies written out; only names, values and expressions the spec pins.
