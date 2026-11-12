# framework-map.md template

Saved in the agent's memory folder (`.claude/agent-memory/qa-tester/`), one per
repository, with one line in `MEMORY.md`:
`- Test framework map and decision (<pending|standard|existing>) → framework-map.md`.
Update that line whenever the decision changes.

**Shared file:** `.claude/skills/mapping-existing-framework/SKILL.md` points
to this path. If you move or rename it, update that skill too.

````markdown
---
name: framework-map
description: How this repo's tests are organised and which framework to follow
metadata:
  type: project
---

Decision: <pending | standard | existing> (<YYYY-MM-DD>, confirmed by the user | built by building-playwright-framework)

## Test folders
<where specs live; ui/api split; seed specs>

## Page objects and components
<where they live, or "none"; how they're written>

## Fixtures and helpers
<what exists and where; how login/setup is done>

## Test data
<where it lives; how it's built>

## Config
<config file, projects, testDir, baseURL, browsers, retries>

## Locators
<how locators are written: test ids, roles, CSS ...>

## Credentials and environments
<variable or file names only, never values>

## Naming
<file, test and class naming>

## Running tests
<local commands; what CI runs (read-only look at the workflow)>

## Diagram
```mermaid
flowchart LR
  <specs> --> <fixtures> --> <page objects> --> <base page>
```

## Rules to follow in this repo
1. <3-10 short, checkable rules the other skills apply>

## Legacy tests (only when a new framework was built over existing tests)
<folder and Playwright project of the tests not yet moved, and the rules
they still follow (copied from the previous confirmed map)>

## Notes
<things noticed while mapping, not changed>
````
