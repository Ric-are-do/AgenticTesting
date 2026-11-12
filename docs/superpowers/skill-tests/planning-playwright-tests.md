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

## 2026-11-12: framework map, app docs and journey map (plan Task 6)

Scratch copies of the standard Swag Labs framework from the building skill's
REFACTOR run (`framework-map.md` decision `standard`).

### RED: old skill

| Case | What happened |
|------|---------------|
| P1 "Write a test plan for Swag Labs product sorting" | Plan in `specs/swag-labs/` (the folder existed). **Read `overview.md` and `journey-map.md` whole** instead of scanning frontmatter. **Saved none of what it learned** (sort options, tie order, reset on reload) to `docs/apps/`; it stayed only in the plan. No framework-map step. |

### GREEN

| Case | Result |
|------|--------|
| P1 with a journey map | ✅ Read `framework-map.md` first; `Grep ^description:` over `docs/apps/swag-labs/`, then opened the matches; journey map found so no re-map; explored sorting only; plan `specs/swag-labs/product-sorting.md` (9 scenarios, existing seed); new `docs/apps/swag-labs/product-sorting.md` with five fields; no password. |
| P2 no journey map | ⚠️ Ran mapping-site-journeys first (✅), plan and docs with frontmatter, no password. **But the journey map was partial** (only what sorting needed; checkout and Dynamic Catalog left out), and it mixed the read-only mapping with planning ("deviation from the read-only rule: clicked add-to-cart"). |

### REFACTOR

Planning step 2 now says: run mapping-site-journeys "as its own complete
step: the whole site, under its read-only rules, finished and saved before you
start planning".

| Case | Result |
|------|--------|
| P2 re-run | ⚠️ Mapping now a separate read-only step (✅), plan with 12 scenarios, docs with frontmatter, no password. **Still a partial map**: "Dynamic Catalog: not opened (outside the sorting area)", and it called the Checkout button a write action. Cause is in mapping-site-journeys, not planning: when called for one area it narrows the map. |

### REFACTOR 2 (mapping-site-journeys)

Read-only rules now start with "The whole site, always ... 'Outside the area
I'm working on' is never a reason to leave a page out", and say buttons that
only open a page (Checkout, Next, Add-that-opens-a-form, Edit) are fine; the
write is the button that saves or submits.

| Case | Result |
|------|--------|
| P2 re-run after REFACTOR 2 | ⚪ **Not observed.** The subagent was stopped by an API safeguard error ("Sonnet 5.5's safeguards flagged this message", request req_011Cgy6qkzeA3Eaaw1o67xr3), a system issue. Counted as pass by user instruction (2026-11-12). The "whole site, always" fix is therefore untested by a run. |
