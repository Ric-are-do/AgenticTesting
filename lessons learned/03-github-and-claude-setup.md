# GitHub and Claude Setup

How we connected this project to GitHub Actions and the Claude Code GitHub
integration. Each step says what we did and what it does.

**Video walkthrough of this setup:** https://www.youtube.com/watch?v=7pKN_pjPW04

**Official documentation:** https://code.claude.com/docs/en/github-actions
(Claude Code GitHub Actions: quick and manual setup, secrets, organization rollout.)

Repo: https://github.com/Ric-are-do/AgenticTesting (public, default branch `main`)

---

## Step 1. Check the GitHub CLI (`gh`)

```powershell
gh --version
gh auth status
```

**What it does:** confirms the GitHub CLI is installed and that you are logged
in. `gh` lets us look at runs, PRs and comments from the terminal.

State on this machine (2026-11-04):

- `gh` 2.78.0 installed, logged in as `Ric-are-do`.
- Token scopes: `gist`, `read:org`, `repo`, `workflow`.
  - `repo`: create repos and push.
  - `workflow`: change files in `.github/workflows/` and manage Actions runs.

## Step 2. Put the project on GitHub

1. Create the repository on GitHub (`Ric-are-do/AgenticTesting`).
2. Push the project with a first commit.

**What it does:** GitHub Actions only runs for code that is on GitHub, and the
Claude app needs a repository to be given access to.

**Gotcha:** running `/install-github-app` before the repo existed did nothing.
The first attempt ended with "Installation cancelled by user". The repository
has to be published first.

The folder on disk can be out of step with GitHub (we found the remote already
had commits and the local folder was missing them). Link and update it with:

```powershell
git remote add origin https://github.com/Ric-are-do/AgenticTesting.git
git fetch origin
git pull --ff-only
```

`--ff-only` refuses to merge anything unexpected, and uncommitted local edits
are kept.

## Step 3. Install the Claude GitHub app (`/install-github-app`)

In a Claude Code session, type:

```
/install-github-app
```

You type this yourself; Claude cannot run slash commands for you.

**What it does:** walks you through giving the Claude GitHub app access to the
repo you choose, stores a Claude token as a repository secret
(`CLAUDE_CODE_OAUTH_TOKEN`), and opens a pull request that adds two workflow
files. The second run finished with "GitHub Actions setup complete!".

**What it created:** PR #1 "Add Claude Code GitHub Workflow", which we merged.
It added:

| File | Runs when | What it does |
|---|---|---|
| `.github/workflows/claude.yml` | Someone writes `@claude` in an issue, issue comment, PR comment or PR review | Claude reads the request and does the work (answers, edits code, opens a PR) |
| `.github/workflows/claude-code-review.yml` | A PR is opened, updated, reopened or marked ready | Claude reviews the PR and posts inline comments |

Both use `anthropics/claude-code-action@v1`.

## Step 4. Tune the Playwright workflow

The workflow from `npm init playwright@latest` is
`.github/workflows/playwright.yml`. It runs the tests on every push and PR to
`main`. We changed it for this project:

| Change | Where | Why |
|---|---|---|
| `npx playwright install chromium` instead of `install --with-deps` | `playwright.yml` | Install one browser, not all three plus system packages. Faster. |
| Removed the `firefox` and `webkit` projects | `playwright.config.ts` | We only test Chrome, so there is nothing to run for them. |
| `workers: process.env.CI ? Math.max(1, Math.floor(os.cpus().length / 2)) : undefined` | `playwright.config.ts` | The tests are independent, so they can run side by side. On CI we use half of the runner's cores, worked out on the runner itself. |
| `headless: !!process.env.CI` | `playwright.config.ts` | `headless: false` needs a screen. CI runners have none, so it stays headed locally and headless on CI. |

Notes:

- This installs **Chromium**, not Google Chrome. Chrome itself would need
  `channel: 'chrome'` and a system install on the runner.
- A standard GitHub runner for public repos has 4 cores, so expect 2 workers.
  (Not yet checked in a run log.)

## Step 5. Watch runs from the terminal

```powershell
gh run list -R Ric-are-do/AgenticTesting --limit 10
gh run view <run-id> -R Ric-are-do/AgenticTesting --log
```

**What it does:** shows each workflow run with its result, branch and trigger,
and the full log for one run.

## Step 6. Try the whole loop

What happened in this repo on 2026-11-04, read from the run list:

1. A test was pushed to `main` that fails on purpose ("failed on purpose
   throwing error"). **Playwright Tests** failed, as it should.
2. Issue #2 "Failing test" was opened mentioning `@claude`. That fired
   **Claude Code** (`claude.yml`).
3. Claude created branch `claude/issue-2-20261104-1917` and opened PR #3 "fix:
   use correct password in locked-out login test".
4. On PR #3, **Playwright Tests** passed and **Claude Code Review** ran.
5. PR #3 was merged.

## Where the Claude review shows up

Claude Code Review posts **inline comments on the PR** (Files changed tab).
Nothing is written to the repo. The run log is in the Actions tab and is kept
for GitHub's retention period (90 days by default).

---

## Lessons learned

- **Publish the repo before `/install-github-app`.** Without a repo on GitHub
  there is nothing to install into.
- **Seeing a change in the editor is not a commit.** Edits show as uncommitted
  changes until you commit them yourself.
- **Check that local and GitHub match before editing.** The remote had commits
  the local folder did not (the merged PR #1), so we fetched and fast-forwarded
  first.
- **A successful review run can post nothing.** On PR #3 the Claude review
  finished without error (8 seconds, 3 turns, no permission denials) and logged
  "No buffered inline comments". The workflow only posts inline comments, so a
  clean review looks the same as no review. To always see a result, the review
  prompt would need to ask for a summary comment.
- **`headless: false` breaks CI.** Make it depend on `process.env.CI`.
- **Mention `@claude` to hand Claude work.** An issue with `@claude` in its
  title or body is enough to start `claude.yml`.

### Interactive and automation modes

Source: https://code.claude.com/docs/en/github-actions#interactive-and-automation-modes

This text is an extract:

> The Claude Code GitHub Action detects how to run from your workflow
> configuration:
>
> **Interactive mode:** when the workflow provides no prompt input, Claude
> waits for the trigger phrase, `@claude` by default, in an issue or pull
> request comment, in a pull request review, or in the body or title of a newly
> opened issue, then responds to that request. Progress and results appear as a
> comment on the triggering issue or PR.
>
> **Automation mode:** when the workflow provides a prompt input, Claude runs
> without waiting for a mention, subject only to the checks on who can trigger
> runs. By default, results appear in the workflow run log rather than a
> comment. Claude can post to the issue or pull request when the prompt directs
> it to and it has a tool that can post, as in the code-review example.

How this maps to our repo:

- `claude.yml` has no `prompt`, so it is interactive.
- `claude-code-review.yml` has a `prompt`, so it is automation. Its results go
  to the run log unless the prompt tells Claude to post. That explains why the
  review on PR #3 left no comment.

### Pass CLI arguments (`claude_args`)

Source: https://code.claude.com/docs/en/github-actions

This text is an extract:

> The `claude_args` parameter accepts any Claude Code CLI argument:
>
> ```yaml
> claude_args: "--max-turns 5 --model claude-sonnet-5 --mcp-config /path/to/config.json"
> ```
>
> Common arguments:
>
> - `--max-turns`: limit the number of conversation turns
> - `--model`: model to use, for example `claude-sonnet-5`. Without this
>   argument, the Claude Code GitHub Action uses the Claude Code default model
> - `--mcp-config`: path to MCP configuration
> - `--allowedTools`: comma-separated list of allowed tools. The
>   `--allowed-tools` alias also works
> - `--debug`: enable debug output

How this maps to our repo:

- `claude-code-review.yml` already uses `claude_args` to pass `--allowedTools
  "mcp__github_inline_comment__create_inline_comment"`, which limits the review
  to posting inline comments.
- `claude.yml` passes no `claude_args`, so it uses the default model and has no
  turn limit. `--max-turns` would be the first thing to add to cap run length
  and cost.

---

## Things to remember when using Claude in GitHub

Claude in a workflow runs on its own, with no one watching, and every step
costs tokens. Without limits, a confused run can keep going for hours. Sources:
the `claude-code-action` docs (configuration, security, migration guide) and
the Claude Code CLI reference at https://code.claude.com/docs/en/cli-reference.

### Limits to set on every Claude workflow

| Limit | How | What it does |
|---|---|---|
| Job timeout | `timeout-minutes: 15` on the job | GitHub kills the job after 15 minutes, whatever Claude is doing. The hard wall. Without it the GitHub default is 6 hours. |
| Turn limit | `claude_args: --max-turns 30` | Claude stops after N steps. Docs: for controlling cost and keeping runs predictable. |
| Dollar cap | `claude_args: --max-budget-usd 2.00` | Stops the run once estimated spend reaches the amount, including subagents. |
| Concurrency | a `concurrency:` group with `cancel-in-progress: true` | Stops several quick comments or pushes starting several paid runs at once. Standard GitHub Actions feature. |
| Narrow tools | `claude_args: --allowedTools "..."` | Claude gets only the tools it needs, so it has fewer ways to wander. |
| Who can trigger | keep `allowed_bots` empty (the default) | No bots can trigger the action. |

Details to know:

- **The dollar cap can overshoot.** It is checked after each response, so one
  response can push spend past the cap. It is also a client-side estimate, not
  your bill. Leave headroom.
- **The dollar cap is documented as print-mode only.** The action passes any CLI
  argument through `claude_args`, but we have not confirmed the cap takes effect
  inside the action. Test it before relying on it.
- **Never use `allowed_bots: '*'` on a public repo.** The docs warn that
  external GitHub Apps could then invoke the action with a prompt they control.
- **Fewer triggers, lower cost.** `claude-code-review.yml` runs on every push to
  a PR (`synchronize`). Removing that trigger or adding a `paths:` filter means
  fewer paid runs.
- **Account limits are a backstop.** The `CLAUDE_CODE_OAUTH_TOKEN` is tied to
  your subscription, so its usage limits apply. Not looked up in detail yet.

### Where this repo stands (2026-11-05)

| Workflow | Turn limit | Job timeout | Dollar cap | Concurrency |
|---|---|---|---|---|
| `claude.yml` (`@claude`) | `--max-turns 30` (written, not on `main` yet) | none | none | none |
| `claude-code-review.yml` (every PR) | none | none | none | none |

Not added yet: this list is what to implement next. `playwright.yml` has a
60-minute timeout, far more than the suite needs.

### Other things to remember

- **Public repo means public triggers.** Anyone can open an issue or comment.
  Check who is allowed to start a run before relying on `@claude` being safe.
- **A run that posts nothing can still cost money.** The review on PR #3 made no
  comment but still ran and cost about $0.056.
- **Check the Actions tab for run times.** A run that takes far longer than
  usual is the early warning that a limit is missing.
- **Claude only does what the workflow allows.** Default tools are file
  operations, comments and basic GitHub actions. Shell commands must be allowed
  one by one with `--allowedTools`.
