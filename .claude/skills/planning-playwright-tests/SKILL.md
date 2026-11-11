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

1. **Read what exists.** Read every plan in `specs/` and list the tests in
   `tests/`. Don't plan scenarios that are already covered; refer to them.
2. **Find the seed.** Use the seed spec for that app area (for example,
   `tests/swag Lab tests/seed.spec.ts`). If none exists, name the path the
   generator should create next to the area's tests.
3. **Explore the live app with playwright-cli** (REQUIRED: the playwright-cli
   skill for commands). Open the URL, take snapshots, and walk every journey
   you'll plan, including the error paths. Note the real text, URLs and
   `data-test` attributes you see.
4. **Design the scenarios:** happy paths, edge cases, and errors or
   validation. Each one starts from a fresh browser, is independent of the
   others, and is specific enough for any tester to follow.
5. **Write the plan** to `specs/<app-area>.md` in the format below.
6. **Close the browser** (`playwright-cli close`).

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
- Skipping the existing `specs/`, and duplicating a scenario.
- Steps that depend on an earlier scenario's state.
- Inventing your own plan layout. The generator relies on `**Seed:**`,
  `**File:**` and `- expect:`.
