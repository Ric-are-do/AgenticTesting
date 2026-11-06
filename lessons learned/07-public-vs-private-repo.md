# Public vs Private Repository

What changes when a GitHub repo goes from public to private, what the limits
are, and how it protects the Claude subscription that our workflows use.

Checked on 2026-11-06 against the GitHub docs. Plans and prices change, so
check **Settings → Billing and plans** for the current numbers.

## Why we cared

Our workflows run Claude using `CLAUDE_CODE_OAUTH_TOKEN`, which is tied to our
Claude subscription. Every run uses some of the plan's usage limits. On a
public repo anyone can open an issue or comment, so the worry was:
**could a stranger write `@claude ...` and spend our subscription?**

## Who can start Claude today

| Workflow | How it starts | Can a stranger trigger it? |
|---|---|---|
| `claude.yml`, job `claude` | `@claude` in an issue or comment | **No.** `claude-code-action` checks that the commenter has write access before it runs Claude. The job still *starts*, but it stops before using Claude. |
| `claude.yml`, jobs `parse` + `investigate` | `@claude investigate [run <id>]` | **No.** The job's `if:` only allows `OWNER`, `MEMBER` or `COLLABORATOR`. This matters because this path uses the Claude CLI, which does no permission check of its own. |
| `playwright.yml`, job `investigate` | A failed test run | **No.** It runs on pushes (only people with write access can push) and on PRs from branches in this repo. PRs from forks are skipped, and forks get no secrets anyway. |
| `claude-code-review.yml` | Manual "Run workflow" button | **No.** Only people with write access can start workflows by hand. |

So even while public, strangers can't spend the subscription. Making the repo
private adds a second layer: strangers can't see the repo or comment at all,
so if one of these checks were removed or broken by mistake, nobody outside
could exploit it.

## What changes when it goes private

### GitHub Actions is no longer free

- **Public repos:** Actions on standard GitHub-hosted runners is **free and
  unlimited**.
- **Private repos:** usage comes out of the account's monthly allowance. Above
  that it is billed, or blocked if no payment method or budget is set.

| Plan (personal account) | Included compute per month | Artifact storage |
|---|---|---|
| Free | $12 of compute (about 2,000 Linux minutes) | 500 MB |
| Pro | $18 of compute (about 3,000 Linux minutes) | 1 GB |

Older docs give these allowances as minutes (2,000 / 3,000). Newer ones give a
dollar amount. Either way it works out to the same number of Linux minutes.

**Our usage (estimate):**
- **Run lengths:** a Playwright run is about 1 minute, an investigator run
  about 3–5, an `@claude` run 1–2.
- **Rounding:** every job is rounded up to a whole minute.
- **Total:** even at a few dozen runs a week, that's roughly **100–300 minutes
  a month**, well inside the Free plan.

**Storage:**
- We were using **21 MB** of artifacts: Playwright reports, traces and
  investigator reports, kept for 30 days.
- If it gets close to the limit, lower `retention-days` in `playwright.yml`.

### Other consequences

- **Stars and watchers are erased.** We had 0 of each, so nothing was lost.
- **Existing public forks stay public**, cut off from the repo. We had 0
  forks.
- **On the Free plan, some features are not available for private repos:**
  - protected branches and required reviewers;
  - code owners;
  - wikis;
  - repo insights graphs;
  - GitHub Pages (a published site is unpublished).
  
  We didn't use any of these: `main` has no protection rules and there's no
  Pages site.
- **Code scanning and other GitHub Advanced Security features** stop working
  without a paid license. We weren't using them.
- **Dependabot alerts and the dependency graph keep working.** Custom
  Dependabot alert rules are switched off.
- **Links to PRs, runs and artifacts only work for people with access.**

### What keeps working

- The Claude GitHub App and `CLAUDE_CODE_OAUTH_TOKEN`, so `@claude`, the
  investigator and the review workflow all keep working.
- Every workflow in `.github/workflows/`, which just uses minutes now.
- Collaborators you add keep full access, as before.

## How to switch (either way)

- **Web:** **Settings → General → Danger Zone → Change repository visibility.**
- **CLI:**

```bash
gh repo edit Ric-are-do/AgenticTesting --visibility private --accept-visibility-change-consequences
```

You can make it public again the same way. Stars and watchers are not
restored.

## Takeaways

1. **The real protection is the permission checks, not the visibility.** Any
   workflow that spends the Claude subscription must check who started it:
   - `claude-code-action` does this itself;
   - a raw `claude -p` step needs an `author_association` check in `if:`.
2. **Private is a good second layer** for a repo whose CI can spend money,
   and it costs us nothing at our usage.
3. **Watch Actions minutes and storage after going private.** Check
   **Settings → Billing → Usage** once a month, at least at first.
4. **Keep forks out of secret-spending jobs.** If the repo is ever public
   again, skipping fork PRs in `playwright.yml` still matters.

See also [06-cli-vs-mcp-pricing.md](06-cli-vs-mcp-pricing.md) for what each
Claude investigation costs.
