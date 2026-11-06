# claude.yml Explained

The file `/install-github-app` adds at `.github/workflows/claude.yml`, as it
was installed (PR #1, before any of our edits). The comments below are added
here to explain each part. They are not in the real file.

What it does in one line: when someone writes `@claude` in an issue or PR,
this workflow starts Claude on a GitHub machine and Claude does what was asked.

```yaml
name: Claude Code                 # Name shown in the Actions tab

on:                               # Events that START this workflow
  issue_comment:                  # A comment on an issue or on a PR conversation
    types: [created]              #   only when the comment is new (not edited/deleted)
  pull_request_review_comment:    # A comment on a specific line of a PR's code
    types: [created]              #   only when new
  issues:                         # An issue itself
    types: [opened, assigned]     #   when it is opened or assigned to someone
  pull_request_review:            # A full PR review (Approve / Request changes / Comment)
    types: [submitted]            #   only when submitted

jobs:                             # Work to do. This file has one job
  claude:                         # Job name (our choice)
    if: |                         # Run the job ONLY if one of these is true (else it is skipped)
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      #  ^ issue/PR comment AND the comment text contains @claude
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      #  ^ line comment on a PR AND it contains @claude
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      #  ^ PR review AND the review text contains @claude
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))
      #  ^ new issue AND @claude is in its title or body
    runs-on: ubuntu-latest        # The machine: a fresh Ubuntu VM, deleted after the job
    permissions:                  # What the job's built-in GitHub token may do
      contents: read              #   read the repo's files
      pull-requests: read         #   read PRs
      issues: read                #   read issues
      id-token: write             #   let the job prove its identity (used by the action to sign in)
      actions: read # Required for Claude to read CI results on PRs   #   read workflow runs and logs
    steps:                        # The job's steps, run in order
      - name: Checkout repository # Step label shown in the log
        uses: actions/checkout@v4 #   ready-made action: copies the repo onto the VM
        with:                     #   its settings:
          fetch-depth: 1          #     only the latest commit (fast, no full history)

      - name: Run Claude Code     # Step label
        id: claude                #   an ID, so later steps could read this step's outputs
        uses: anthropics/claude-code-action@v1   # The Claude action; @v1 = the v1 line of releases
        with:                     #   its settings:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          #  ^ how Claude signs in. Read from a repo secret that /install-github-app
          #    saved. ${{ ... }} is how workflows read values; secrets are hidden in logs.

          # This is an optional setting that allows Claude to read CI results on PRs
          additional_permissions: | #   extra access for the action itself (block of text)
            actions: read           #   same permission as above: read CI runs

          # Optional: Give a custom prompt to Claude. If this is not specified, Claude will perform the instructions specified in the comment that tagged it.
          # prompt: '...'           #   commented out. No prompt = "interactive mode": Claude does
          #                         #   what the @claude comment says. With a prompt it would run
          #                         #   on its own, with no mention needed.

          # Optional: Add claude_args to customize behavior and configuration
          # claude_args: '...'      #   commented out. Where limits and allowed tools go,
          #                         #   e.g. --max-turns, --allowedTools
```

## Things to notice

- **Many runs start, few do work.** Every new comment or issue starts the
  workflow, and the `if:` then skips it unless `@claude` appears. Skipped runs
  in the Actions tab are normal.
- **No prompt means interactive mode.** The action decides its mode from the
  inputs: no `prompt` means it waits for `@claude`; a `prompt` means it runs
  right away.
- **No limits by default.** The installed file has no turn limit, no job
  timeout and no tool list. See the "Things to remember" section in
  `03-github-and-claude-setup.md`.
- **Read-only token.** All four permissions are `read` except `id-token`. Claude
  can look at things but the job's own token cannot write to the repo.

## What we changed afterwards

| Change | Why |
|---|---|
| Steps to install Node, dependencies, Chromium and Playwright CLI | The investigator skill needs them |
| `env:` with `GH_TOKEN` and `GH_REPO` | The skill's script uses `gh` |
| `claude_args:` with `--max-turns 30` and `--allowedTools` | Limit the run and allow only the tools the skill and reviews need |
| An upload step for `reports/` | Keep the skill's report as the `ci-failure-report` artifact |
