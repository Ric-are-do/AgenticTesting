# planning-playwright-tests: test log

Prompt (same for every round): "Write a test plan for the Swag Labs cart
(https://www.saucedemo.com, user standard_user / secret_sauce). Save it under
specs/_skill-tests/." Fresh `sonnet` general-purpose subagent.

## RED: no planning skill (2026-11-10)

What it did, from its own log:
- **Never opened the app.** "The scenarios come from my general knowledge of
  Swag Labs, so the expected results are unverified against the live site."
  It didn't try `playwright-cli` because the MCP server was down.
- **Didn't read the existing plans in `specs/`.** It only ran `ls`, so it
  duplicated "checkout with missing info", which `swag-labs-critical-path.md`
  already covers.
- **Didn't follow the repo plan format.** It used `## 1.` / `### 1.1` and a
  prose "Seed state:" line, with no `**Seed:**` path, no `**File:**` per
  scenario and no `- expect:` lines.
- **No locators**, so nothing a generator could reuse.
- Good: 19 scenarios, 6 negative.

## GREEN attempt 1: invalid (skill not discovered)

The subagent behaved exactly as in RED and loaded no skill. Cause: skill
folders created during a running session aren't discovered
(`Unknown skill: planning-playwright-tests`). Re-run with the SKILL.md text
given to the subagent as an already-loaded skill.

## GREEN attempt 2: pass (2026-11-10)

SKILL.md text given as a loaded skill. What it did:
- Read `specs/swag-labs-critical-path.md` and the seed, and did not repeat
  the checkout happy path.
- Explored the live app with `playwright-cli` (open, fill, click, snapshot,
  eval, reload, a fresh logged-out session, close). No MCP calls.
- Plan matches the repo format: `### 1.` group, `**Seed:**`
  `tests/swag Lab tests/seed.spec.ts`, 9 `#### 1.N.` scenarios, each with
  `**File:**`, and 28 `- expect:` lines with live text, e.g.
  "Epic sadface: You can only access '/cart.html' when you are logged in."
- 4 negative scenarios. It flagged a possible defect: checkout is allowed
  with an empty cart.

Not refactored: it piped a few commands to `>/dev/null` and didn't read
their output. Its expectations still came from `eval` reads, so this was
left as an observation rather than adding untested wording.
