---
name: mapping-existing-framework
description: Use when a repo already has test automation (Playwright, Cypress, Selenium or other) and there is no framework-map.md in the agent's memory, or when the user asks to map, describe or re-map how the tests in this repo are organised, such as "map how our tests work" or "learn this test framework before writing tests".
---

# Mapping an existing test framework

## Overview

Before working in someone else's test framework, learn it, write it down, and
**get the user to confirm it**. A map nobody confirmed is a guess. Once
confirmed, it lives in the agent's memory and every later task follows it.

## When to use

- The repo has test automation and no `framework-map.md` in
  `.claude/agent-memory/qa-tester/`, and the user agreed to mapping.
- The user asks to map or re-map the tests.
- Not for an empty repo (use building-playwright-framework) and not for
  mapping a website (use mapping-site-journeys).

## Process

1. **Read, don't change.** Look at the test framework only: test config files
   and their `testDir`, test folders, page objects, fixtures and helpers, test
   data, how locators are written, how login and setup are done, naming, the
   run commands (`package.json` scripts), and the test steps of CI workflows
   (read-only). Never edit a file while mapping. Running the tests is optional.
2. **Write the map** in the layout of
   `.claude/skills/building-playwright-framework/framework-map-template.md`
   (shared by both skills): frontmatter; the line
   `Decision: pending (mapped <date>, not yet confirmed)`; every section,
   filled from what you actually saw (write "none" rather than leaving one
   out); a Mermaid diagram of how the parts depend on each other; and
   **Rules to follow in this repo**: 3-10 short, checkable rules taken from
   how the existing tests are written.
3. **Credentials:** name where they come from (`SECRET_PW in .env`,
   "password hardcoded in tests/login.spec.ts"), never the value. That
   includes hardcoded and "public demo" passwords: they still don't go in the
   map. Never print or copy a value from `.env` or a test.
4. **Confirm.** Show the user the full map and ask: "Is this right? Anything
   to correct?" Running as a subagent, you cannot ask: **stop and report the
   map and that question**. Save nothing yet.
5. **On a yes** (or after corrections): save it as
   `.claude/agent-memory/qa-tester/framework-map.md` and add
   `- Test framework map and decision (pending) → framework-map.md` to
   `MEMORY.md`. The decision (`existing` or `standard`) is filled in when the
   user answers the agent's "new or existing framework?" question.

## Quick reference

| Situation | Do |
|-----------|----|
| User confirms | Save map + `MEMORY.md` line |
| User corrects | Fix the map, show it again |
| No confirmation yet | Save nothing |
| A map exists but a folder it names is gone | Say it looks out of date, ask before re-mapping |

## Common mistakes

- Saving the map straight away "so it's not lost". Confirm first.
- Leaving out the diagram or the rules because the repo is small.
- Copying a password into the map "for reference" or "because it's public".
- "Fixing" something you noticed while mapping. Report it in the map's notes.
