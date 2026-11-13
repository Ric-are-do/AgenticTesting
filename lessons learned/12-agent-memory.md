# Agent Memory: A Knowledge Base the QA Tester Builds Itself

How the qa-tester remembers what it learns between calls, how the files are
laid out, and what happens when the repo tests more than one app. This builds
on [11-qa-tester-super-agent.md](11-qa-tester-super-agent.md).

Source: [Subagents: enable persistent memory](https://code.claude.com/docs/en/sub-agents)
(Claude Code docs).

## Why

Every call to a subagent starts with a clean slate. Without memory, the tester
rediscovers the same things each time: the real login locator, that two test
runs in one folder clash, that you never want it to commit. Memory lets it
write those down once and read them next time.

## How it's switched on

One line in the agent's frontmatter (`.claude/agents/qa-tester.md`):

```yaml
memory: project
```

That's the whole setup. Claude Code then:

1. Creates (or uses) the folder `.claude/agent-memory/qa-tester/`.
2. **At startup** it puts the first 200 lines (or 25KB) of `MEMORY.md` into
   the agent's instructions, and tells the agent it can read and write the
   folder.
3. Turns on `Read`, `Write` and `Edit` so the agent can manage the files.

It only works if auto memory is on, which it is by default.

| Scope | Folder | Who sees it |
|-------|--------|-------------|
| `project` (ours) | `.claude/agent-memory/qa-tester/` | Everyone with the repo. **Committed to git.** |
| `local` | `.claude/agent-memory-local/qa-tester/` | Only this machine (not committed) |
| `user` | `~/.claude/agent-memory/qa-tester/` | Only you, across all your projects |

The docs recommend `project`. We picked it because the knowledge is about
*this* repo's tests, and committing it means it's reviewed and shared.

## How it's laid out

`MEMORY.md` is **only an index**: one short line per note, each pointing to
the topic file with the detail. Only the index is loaded automatically, so
keeping it short keeps every call cheap. The agent opens a topic file only
when the index says it's relevant.

Current layout (since 2026-11-13; before that, all app notes sat in one
shared `app-knowledge.md`):

```
.claude/agent-memory/qa-tester/
  MEMORY.md             index, loaded at every start
  framework-map.md      how this repo's tests are organised
  failure-patterns.md   failures and flaky tests, and their real cause
  environment.md        machine, repo and tool gotchas
  ci.md                 patterns from CI investigations
  decisions.md          your general rules and preferences, and why
  apps/
    <app>/memory.md     one app's rules, approvals, quirks and bugs
```

Index lines look like this:

```
- swag-labs → apps/swag-labs/memory.md: credential defaults approved; login button, empty-cart checkout bug
- Don't run several `npx playwright test` at once in one folder → environment.md
```

## Telling the agent when to use it

`memory: project` gives the agent a folder. It doesn't tell it **when** to
read or write it. That's in the agent file's "Your memory" section:

- **Before starting:** check the index for anything about this page, test or
  failure, and read the topic files it points to.
- **Before reporting:** save what it learned. Update a note rather than add a
  duplicate, and fix or delete notes that were wrong.
- **Don't save:** what's already in the code, skills or `CLAUDE.md`, one-off
  details, guesses, or secrets.
- **Keep `MEMORY.md` under 150 lines**, which leaves room under the 200-line
  limit.
- **List every memory file it changed** in its report, so you see it.

One snag: the tester's boundaries forbid editing anything in `.claude/`. We
had to add its own memory folder as the one exception, or it couldn't save.

## What happens with more than one app

The memory belongs to **the agent in this repo**, not to an app. Swag Labs,
the practice login site and the delivery app you're about to add all share
the one folder and the one `MEMORY.md`.

What that means in practice:

- **App notes get mixed.** `app-knowledge.md` would hold locators for every
  app in one file. A note that's true for one app (`[data-test=login-button]`)
  could be applied to another.
- **Every call loads every app's index lines.** When testing the delivery
  app, the tester still reads Swag Labs notes. That's noise and tokens, and
  all the apps share the 200-line budget.
- **Some files are fine shared.** `environment.md`, `decisions.md` and `ci.md`
  apply to every app.

The ways to handle it:

| Option | How | When |
|--------|-----|------|
| **Split by app inside the folder** | Shared files stay; each app gets its own file (`apps/swag-labs.md`, `apps/delivery-app.md`); `MEMORY.md` gets one heading per app; the agent works out which app a task is for first | Several apps in **this** repo (the likely next step) |
| **Separate repos** | Each repo has its own `.claude/agent-memory/qa-tester/` | The apps are truly separate projects |
| **`user` scope** | One memory across all your projects | Your general preferences, not app locators |

> **Changed 2026-11-13:** we did the first option. General notes stay at the
> top of `.claude/agent-memory/qa-tester/`; each app has a subfolder,
> `apps/<app>/memory.md` (rules and approvals, quirks and possible bugs,
> pointers to its docs). `app-knowledge.md` is gone. `MEMORY.md` has an
> "Apps" section with one line per app and the rule "read the app's memory
> before working on it". An app's memory is deleted only when you ask:
> removing its code keeps its rules (e.g. qa-practice's contact-form limit).
> The agent file and two skills changed too, to point at the new paths.

Before that change we expected only the memory layout to move; in the end the
agent file and the skills that name memory files had to follow.

## Memory vs the other places knowledge lives

| Place | Who writes it | What it's for |
|-------|---------------|---------------|
| `CLAUDE.md`, `~/.claude/rules/` | **You** | Rules the agent must always follow |
| `.claude/agent-memory/qa-tester/` | **The agent** | Things it learned, which it may update or drop |
| `lessons learned/` | **You** (with Claude) | What you learned, for yourself |

**Memory is notes, not rules.** The agent can rewrite or delete a note, so
anything it *must* obey belongs in `CLAUDE.md` or rules, not in memory.

## Things worth knowing

- **Your own auto memory doesn't reach subagents.** The notes Claude keeps
  for you in your normal sessions aren't loaded into a called agent. Only
  its own `memory:` folder is.
- **Review it like code.** Because memory is committed, every change the
  agent makes shows up in `git status`. Read it before committing; a wrong
  note will mislead every future call.
- **Seed it with facts you've confirmed.** We started it with things proven
  while building (the login locator, the empty-cart checkout bug, the
  parallel-run clash, your git rule), not with guesses.
- **Still to test:** two calls in a row: one that should save a note, then
  one that should use it. (TODO item 2.)
