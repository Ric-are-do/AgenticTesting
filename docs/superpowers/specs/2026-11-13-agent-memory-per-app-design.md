# Agent memory: general plus one subfolder per app

Date: 2026-11-13. Size: small change. TODO item 6.

## Why

The qa-tester's memory is one flat folder. Notes about every app sit in
shared files (`app-knowledge.md`, `decisions.md`, `MEMORY.md`), next to the
agent's own notes. That makes no sense to the user, and it made removing
qa-practice messy: its notes were spread over three files.

## Goals

- The agent's own memory (tools, test runs, the user's general rules, the
  repo's framework map) is separate from each app's memory.
- Each app has its own memory subfolder. Removing an app means removing one
  folder plus one index line.

Non-goals: memory shared across repos (user scope), one repo per app. Both
stay open in the TODO.

Anti-goal: the agent working on an app without reading that app's memory
(e.g. missing a safety rule like "never submit the contact form").

## Approaches

- **A. App memory inside each app folder** (`apps/<app>/memory.md`). Fits
  "the app folder holds everything", but splits the agent's memory over the
  repo.
- **B. One subfolder per app inside the agent's memory**
  (`.claude/agent-memory/qa-tester/apps/<app>/`). All memory in one place.
  **Chosen by the user.**
- **C. Fold app notes into `apps/<app>/docs/`.** Fewest files, but mixes app
  facts with the agent's working notes and per-app approvals.

## Design

```
.claude/agent-memory/qa-tester/
  MEMORY.md             index (auto-loaded): general lines + "Apps" section
  environment.md        general: tools, test runs, this machine
  decisions.md          general: the user's rules for all work
  failure-patterns.md   general
  ci.md                 general
  framework-map.md      this repo's framework (shared by all apps)
  apps/
    swag-labs/
      memory.md         Swag Labs only
    qa-practice/
      memory.md         qa-practice only
```

- **Per-app `memory.md`:** frontmatter (`app`, `description`, `updated`) and
  three sections: *Rules and approvals* (credential defaults approved,
  safety rules), *Quirks and possible bugs*, *Docs* (pointers to
  `apps/<app>/docs/`). More topic files in the subfolder only when one file
  gets long.
- **`MEMORY.md` "Apps" section:** one line per app,
  `- <app> → apps/<app>/memory.md: <one-line hook>`. Replaces the
  "App knowledge" section.
- **Agent rule:** before working on an app, read
  `apps/<app>/memory.md`. App-specific notes go there, never in the general
  files. A new app gets its subfolder and index line; removing an app removes
  both.
- **Moves:** `app-knowledge.md` is deleted; its Swag Labs notes go to
  `apps/swag-labs/memory.md`. Swag Labs' credential approval moves from
  `decisions.md` to that file; the qa-practice contact-form rule moves to
  `apps/qa-practice/memory.md`. The stale OneDrive path in `environment.md`
  is corrected.
- **References updated:** `.claude/agents/qa-tester.md` (memory section and
  table), the skills that point at `decisions.md` for credential approvals
  (building-playwright-framework `SKILL.md` and `fixtures-and-config.md`),
  any other skill or README line that names `app-knowledge.md`. Lessons
  stay as history, with a short "changed" note where they describe the old
  layout.

## Left to the builder

Exact wording of the notes and index lines; whether a skill needs a one-line
mention of the app memory beyond the agent file.
