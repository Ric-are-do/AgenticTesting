# GitHub and Claude Setup

Notes on connecting this project to GitHub and using Claude Code with it.
Add to this file as we learn more.

## 1. GitHub CLI (`gh`)

Check that it is installed and logged in:

```powershell
gh --version
gh auth status
```

State on this machine (2026-11-04):

- `gh` 2.78.0 is installed.
- Logged in to github.com as `Ric-are-do`, with the token stored in the keyring.
- Token scopes: `gist`, `read:org`, `repo`, `workflow`.
  - `repo` lets us create repos and push.
  - `workflow` lets us push changes to `.github/workflows/` and manage Actions runs.

## 2. Project state before GitHub

- The folder is **not a git repository** and has no remote.
- `.github/workflows/playwright.yml` is the default file from `npm init playwright@latest`.
- `.gitignore` already exists.

## 3. Install the Claude GitHub app (`/install-github-app`)

First step of the integration. Inside a Claude Code session, type:

```
/install-github-app
```

This is a Claude Code slash command, so you type it yourself in the prompt. It
walks you through giving Claude access to the GitHub repository you choose and
setting up GitHub Actions for it.

Notes:

- The repository needs to exist on GitHub first, so do the repo creation step
  below before running this.
- Record here which repo you picked, what the command created (for example any
  new files under `.github/workflows/`), and anything unexpected.

## 4. Steps (fill in as we do them)

- [ ] `git init` and first commit
- [ ] Create the GitHub repo with `gh repo create` and push
- [ ] Review and adjust `.github/workflows/playwright.yml`
- [ ] Watch a run with `gh run list` / `gh run watch`
- [ ] Decide how Claude Code fits in (for example, healing failed CI tests)

## Lessons learned

- Nothing yet. Add each lesson here with the reason it matters.
