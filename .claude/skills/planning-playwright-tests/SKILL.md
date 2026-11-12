---
name: planning-playwright-tests
description: Use when asked for a test plan, test scenarios, test cases or test coverage for a web page, feature or user flow, before any Playwright tests exist for it, or when deciding what should be tested on a site.
---

# Planning Playwright tests

## Overview

A test plan is only as good as what you saw. **Every step and every expected
result in the plan comes from the live app, not from memory.** If you can't
open the app, stop and say so; don't write a plan from general knowledge.

## When to use

- "Write a test plan for X", "what should we test on X", "list test cases".
- Not for writing the test code (use generating-playwright-tests) or fixing
  failing tests (use healing-playwright-tests).

## Process

1. **Read the framework map** (`framework-map.md` in the agent's memory). It
   says where plans, seeds and tests go. No map → stop and go back to the
   agent's map check.
2. **Read what exists.** Search the frontmatter in `docs/apps/<app>/` first
   (e.g. `Grep` for `^description:`) and open only the files that match. No
   `journey-map.md` → run mapping-site-journeys first, **as its own complete
   step**: the whole site, under its read-only rules, finished and saved
   before you start planning. Read the plans in
   `specs/<app>/` and list the tests. Don't plan what's already covered.
3. **Find the seed** where the map says (standard: `tests/<app>/seed.spec.ts`).
   If none exists, name that path for the generator to create.
4. **Explore live, only the area you're planning** (REQUIRED: playwright-cli),
   starting from the journey map. Walk every journey you'll plan, including
   error paths. Note the real text, URLs and test ids you see.
5. **Design the scenarios:** happy paths, edge cases, and errors or
   validation. Each one starts from a fresh browser, is independent of the
   others, and is specific enough for any tester to follow.
6. **Write the plan** to `specs/<app>/<area>.md` (or where the map says) in
   the format below. `**File:**` paths follow the map (standard:
   `tests/<app>/ui/`).
7. **Save what you learned** about the app (rules, quirks, exact behaviour)
   to `docs/apps/<app>/<area>.md` with the five frontmatter fields (`app`,
   `area`, `title`, `description`, `updated`). Never a password.
8. **Close the browser** (`playwright-cli close`).

## Plan format (required)

```markdown
# <App> <Area> Test Plan

## Application Overview

<One paragraph: URL, scope, credentials, "fresh browser state assumed".>

## Test Scenarios

### 1. <Group title>

**Seed:** `<path to seed spec>`

#### 1.1. <Scenario title>

**File:** `<test folder>/<kebab-scenario-title>.spec.ts`

**Steps:**
  1. <Action, naming the real locator, e.g. click [data-test=checkout]>
    - expect: <observable result, with exact text or URL seen live>
```

## Quick reference

| Check | Good |
|-------|------|
| Source of expectations | Seen in a live snapshot |
| Locators named | `[data-test=...]`, role or visible text |
| Negative cases | At least one per group, where the area has errors |
| Overlap | Existing scenarios referenced, not repeated |

## Common mistakes

- Writing expected text from memory. The live text often differs.
- Reading every doc in `docs/apps/` instead of scanning frontmatter.
- Learning how the app behaves and keeping it only in the plan.
- Skipping the existing `specs/`, and duplicating a scenario.
- Steps that depend on an earlier scenario's state.
- Inventing your own plan layout. The generator relies on `**Seed:**`,
  `**File:**` and `- expect:`.
