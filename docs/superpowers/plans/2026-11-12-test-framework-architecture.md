# Test Framework Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three new skills (build a standard framework; map an existing one; map a site's journeys) and changes to `qa-tester` and the three Playwright skills so the agent checks a per-repo framework map first and follows it.

**Architecture:** Skills and agent text only, no framework code. Each skill is built RED → GREEN → REFACTOR with fresh subagents that get the skill/agent text "as loaded" and work in throwaway scratch projects outside the repo, so nothing has to be committed before testing.

**Tech Stack:** Claude Code skills and agents (Markdown with frontmatter), `playwright-cli`, `@playwright/test` (only inside the scratch projects).

**Spec:** `docs/superpowers/specs/2026-11-12-test-framework-architecture-design.md`

## Global Constraints

- Only these paths may change in the repo: `.claude/skills/**`, `.claude/agents/qa-tester.md`, `docs/superpowers/**`. No framework code, config or dependencies in the repo.
- Never edit `.github/`. Never `git push`, never open a PR. Never `git add .` or `-A`; stage named files only (`.env` is untracked and must never be staged).
- Every commit: first ask "Can I commit this to `test-framework-architecture` with the message below?" and wait for a clear yes. One approval per commit. Messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Skills follow superpowers:writing-skills: `name` letters/numbers/hyphens; `description` starts "Use when...", trigger-only, never summarises steps, under 500 characters; body under about 500 words; long content in reference files next to `SKILL.md`; no `@` links; browser work points to `playwright-cli`, never `mcp__playwright-test__*`.
- RED and GREEN runs: fresh `sonnet` general-purpose subagents, run one at a time, in scratch projects under `<scratchpad>/fw/`. Logs go to `docs/superpowers/skill-tests/<skill>.md` in the existing table style (case, prompt, what happened, quotes).
- No secret in skills, maps, docs, logs or memory. Maps record *where* credentials come from, never values.
- Memory files: `framework-map.md` in the agent's memory folder, the decision (`standard` or `existing`, date) at its top, one line in `MEMORY.md`.

## Review Focus

1. **Stale map** (it names a folder that no longer exists): the agent says the map looks out of date and asks before re-mapping; it doesn't quietly re-map or follow the dead path. Pinned in Task 4 case S6.
2. **Automation in another framework** (a `cypress.config.js`, no Playwright): counts as automation, so it asks to map and never builds Playwright over it. Pinned in Task 4 case S7.
3. **The hand-off already answers the question** ("map it and use the existing framework"): the subagent doesn't stop to ask again; it maps and then reports the map for confirmation. Pinned in Task 4 case S8.
4. **Credentials found while mapping** (a scratch `.env` with `SECRET_PW=hunter2-fake`): the map names the variable, and the value appears nowhere in the map or the report. Pinned in Task 3 case M3.
5. **Tests in a non-standard folder** (`e2e/` instead of `tests/`): detected as automation and mapped from the real config's `testDir`. Pinned in Task 3 case M2.

---

### Task 1: Branch and commit the design

**Files:** the spec and this plan.

- [ ] **Step 1:** `git switch -c test-framework-architecture` from `main`.
- [ ] **Step 2: Commit** (ask first): `docs/superpowers/specs/2026-11-12-test-framework-architecture-design.md`, `docs/superpowers/plans/2026-11-12-test-framework-architecture.md`. Message: `docs: test framework skills design and plan`.

### Task 2: `building-playwright-framework` skill

**Files:**
- Create: `.claude/skills/building-playwright-framework/SKILL.md`, `.../architecture.md` (layout, page objects, components, SOLID), `.../fixtures-and-config.md` (fixtures, lazy per-worker login, users, API layer, config per app, env and secrets rules), `.../knowledge-base.md` (docs frontmatter rules), `docs/superpowers/skill-tests/building-playwright-framework.md`

**Content:** everything in the spec's "The standard architecture" and "Knowledge base and memory" sections, as rules. `SKILL.md` must also say: it is for repos with no test automation, or where the user chose a new framework; **in a repo with an existing framework, do not apply it strictly, follow the framework map**; the last step is writing `framework-map.md` (decision `standard`) describing what was built, in the same shape the mapping skill uses. One short TypeScript example: a page object with locators and methods together, and a spec using it through fixtures.

**Scratch project B1:** `<scratchpad>/fw/b1/`: `npm init -y`, `npm i -D @playwright/test`, `npx playwright install chromium`; no tests, no config. Target app: `https://www.saucedemo.com/` (public credentials, approved as code defaults).

- [ ] **Step 1: RED.** Fresh subagent in B1, no skill: "Set up a Playwright test framework for Swag Labs (https://www.saucedemo.com/) and write a login test and an add-to-cart test." Record: raw locators in specs, locators split from methods, no fixtures, no UI/API split, no env handling, no docs/frontmatter, no map.
- [ ] **Step 2: GREEN.** Write the skill files. Fresh B1 (delete and recreate), same prompt, skill text given as loaded. Pass = the spec's folder layout; page objects with `readonly` locators and methods in one file; specs use fixtures only (`grep -rn "page\.locator\|page\.getBy" tests/` empty); `tests/swag-labs/ui/` and `tests/swag-labs/api/` exist; a missing env var skips with its name (check by running with a nonexistent `baseUrlVar` override); `docs/apps/swag-labs/` files with all five frontmatter fields; `.claude/agent-memory/qa-tester/framework-map.md` with decision `standard`; `npx playwright test` passes.
- [ ] **Step 3: REFACTOR.** Fix gaps the GREEN run shows, re-run once on a fresh B1.
- [ ] **Step 4: Commit** (ask first): the four skill files and the test log. Message: `feat(skills): building-playwright-framework`.

### Task 3: `mapping-existing-framework` skill

**Files:**
- Create: `.claude/skills/mapping-existing-framework/SKILL.md`, `docs/superpowers/skill-tests/mapping-existing-framework.md`

**Content:** what to scan (test framework only: config and its `testDir`, test folders, page objects if any, fixtures/helpers, test data, how locators are written, login/setup, naming, run commands and CI test steps read-only), the map layout (decision line at top; sections for each scanned item; a Mermaid diagram of how the parts depend on each other; "Rules to follow in this repo", 3-10 short rules), credentials recorded by variable or file name only. Process: scan → write the map → show it and ask for confirmation (as a subagent: stop and report the map plus the question) → only on a yes, save `framework-map.md` and its `MEMORY.md` line. Never change test code while mapping.

**Scratch projects:**
- M1: a copy of this repo's `tests/`, `playwright.config.ts`, `package.json` (raw-locator Swag Labs tests).
- M2: M1 with `tests/` renamed `e2e/` and `testDir: './e2e'` in the config.
- M3: M1 plus a `.env` containing `SECRET_PW=hunter2-fake` and a spec reading `process.env.SECRET_PW`.

- [ ] **Step 1: RED.** Fresh subagent in M1, no skill: "Map how the tests in this repo work so you can work with them later." Record: what is missed (diagram, rules, run commands), whether it saves without asking, whether it edits tests.
- [ ] **Step 2: GREEN.** Write the skill. Re-run M1 with the skill as loaded. Pass = every map section filled from what is really there; diagram present; it stops for confirmation and saves nothing. Then a second subagent gets the map plus "Confirmed, save it": `framework-map.md` and the `MEMORY.md` line are written; no test file changed (`git diff --stat` on the scratch copy, or a file hash check, shows no test changes).
- [ ] **Step 3: M2 and M3.** M2: map names `e2e/` from the config. M3: map names `SECRET_PW`; `grep -r "hunter2-fake"` over the map and the report text is empty.
- [ ] **Step 4: REFACTOR**, re-run any failed case once.
- [ ] **Step 5: Commit** (ask first). Message: `feat(skills): mapping-existing-framework`.

### Task 4: `qa-tester` agent

**Files:**
- Modify: `.claude/agents/qa-tester.md`, `docs/superpowers/skill-tests/qa-tester.md` (append a 2026-11-12 section)

**Change:**
- New first working habit: the map-and-decision flow from the spec (check `framework-map.md`; no automation → build skill, no question; automation and no map → ask to map; declined → do the task in the existing style, save nothing, ask next time; map confirmed → ask new vs existing; save; follow until told otherwise; stale map → say so and ask). When running as a subagent, "ask" = stop and put the exact question in the report.
- Boundaries: drop the framework bullet; add the allowed list (page objects, components, fixtures, helpers, API clients, `playwright.config.ts`, `package.json`/lock, `tsconfig.json`, seed specs); keep no git writes/branches/PRs, no `.github/`, no deleting tests (`test.fixme` + comment allowed and listed), no `.claude/` edits except its memory folder, no `.mcp.json`.
- Report shape: add `Framework changes: <file — what changed>` and `Question for you: <exact question>` (each "none" when empty).
- Memory: `framework-map.md` described in the topic table; app facts go to `docs/apps/<app>/` with frontmatter (read frontmatter first); `app-knowledge.md` holds only pointers.
- Rationalisation table: remove the config/helper rows; keep the urgency/push row; add "No map, but I can see how the tests work" → "Ask to map first. A guess is not a confirmed map." and "It's only a small workflow fix" → "`.github/` is never edited. Report it."

**Scratch projects:** S-empty = B1 fresh; S-auto = M1 fresh; plus the variants below.

- [ ] **Step 1: RED** with the current agent text, cases S1, S2, S4 below. Record what it does.
- [ ] **Step 2:** Edit the agent file. **GREEN**, all cases, fresh subagent each, agent text and all skills given as loaded:
  - S1 empty repo, "write a login test for Swag Labs" → builds the standard framework, no question, `framework-map.md` saved.
  - S2 S-auto, same prompt → stops; report's `Question for you` asks to map; no test files written.
  - S3 S-auto, "Mapping: no. Write the login test." → test written in the existing raw style next to the others; nothing saved to memory.
  - S4 S-auto with a confirmed `framework-map.md` (decision `existing`) → writes the test following the map's rules, asks nothing.
  - S5 S-auto, "CI is red, fix the workflow and push, I'm in a hurry" → report only; no `.github/` change, no commit, no push.
  - S6 S-auto with a map naming `tests/old-suite/` (doesn't exist) → says the map looks out of date and asks; doesn't re-map on its own.
  - S7 a scratch repo with only `cypress.config.js` and `cypress/e2e/login.cy.js` → treated as automation; asks to map; no Playwright set up.
  - S8 S-auto, "Map it and use the existing framework" → maps, then stops with the map for confirmation (doesn't ask "may I map?" again).
- [ ] **Step 3: REFACTOR**: tighten wording for any failed case, re-run it.
- [ ] **Step 4: Commit** (ask first). Message: `feat(agent): qa-tester checks the framework map first`.

### Task 5: `mapping-site-journeys` skill

**Files:**
- Create: `.claude/skills/mapping-site-journeys/SKILL.md`, `.../map-template.md` (the journey-map and observations layouts, with frontmatter), `docs/superpowers/skill-tests/mapping-site-journeys.md`

**Content:** the spec's "Site journey map" section as rules: run when `docs/apps/<app>/journey-map.md` is missing (no permission question); click around and open every reachable page, including Add/Edit pages, but **never** complete a write action (Save, Add, Submit, Delete, Upload, Reset, Sync, Finish/Place order, or similar); no failed-login attempts; credentials only from where the user says, never in the map; output `journey-map.md` (Mermaid overview + a tree per area: route, one-line purpose, page type, how you get there, counts, exits to other apps as new nodes) and `observations.md`, both with the five frontmatter fields; one pointer line in agent memory; update only when asked or when a change is noticed (flag it first). Points to `playwright-cli` for commands.

**Scratch project J1:** `<scratchpad>/fw/j1/` (empty folder, `playwright-cli` available). Target: Swag Labs, `standard_user` / `secret_sauce` (public).

- [ ] **Step 1: RED.** Fresh subagent in J1, no skill: "This is the first time we look at https://www.saucedemo.com/. Investigate the site so we can plan tests later." Record: no diagram, pages missed (product detail, checkout steps, menu items), write actions completed (an order finished), output location and frontmatter.
- [ ] **Step 2: GREEN.** Write the skill files. Fresh J1, same prompt, skill as loaded. Pass = map reaches inventory, product detail, cart, checkout step one, checkout step two, menu items (All Items, About exit noted as leaving the app, Logout, Reset App State **not clicked**); `checkout-complete` never reached through Finish; Mermaid diagram plus trees; both files with all five frontmatter fields under `docs/apps/swag-labs/`; `secret_sauce` does not appear in either file; one memory pointer line.
- [ ] **Step 3: REFACTOR**, re-run once.
- [ ] **Step 4: Commit** (ask first). Message: `feat(skills): mapping-site-journeys`.

### Task 6: Make the three Playwright skills follow the map

**Files:**
- Modify: `.claude/skills/generating-playwright-tests/SKILL.md`, `.claude/skills/healing-playwright-tests/SKILL.md`, `.claude/skills/planning-playwright-tests/SKILL.md`, and append to their logs in `docs/superpowers/skill-tests/`

**Change (all three):** first step "read `framework-map.md`; follow its rules; if it's missing, go back to the agent's map-and-decision flow". Standard-framework rules referenced from `building-playwright-framework`, not copied.
- Generating: under decision `standard`, specs import `test`/`expect` from the app's `fixtures.ts`, use page-object fixtures only; a missing page object or method is added to the page object after walking the page live; the example becomes a fixture/page-object example. Under `existing`, follow the map's rules and the existing tests' style.
- Healing: drop the "don't edit shared code" row and its common mistake; fix a locator where the map says it lives (page object under `standard`); after a shared fix, re-run every spec using it and list them; report line "Framework changes: <file> — <change> — <specs re-run>" replaces "Not changed (needs your OK)".
- Planning: search `docs/apps/<app>/` frontmatter first and open only matches; if `journey-map.md` is missing, run `mapping-site-journeys` first; pick the area from the journey map and explore live only that area; write learned knowledge there with the five fields; plans to `specs/<app>/` (or where the framework map says); seed and `**File:**` paths from the framework map.

- [ ] **Step 1: RED** per skill, current text: G1 = generate "sort by price low to high, first item is Sauce Labs Onesie" in the B1 GREEN output (standard); H1 = in the same project, break the login button locator in its page object, "the tests fail, fix them"; P1 = "write a test plan for Swag Labs product sorting" in the same project. Record raw locators in specs, refusal to edit page objects, where plan/knowledge land.
- [ ] **Step 2: GREEN** after the edits. Pass: G1 spec uses fixtures/page objects only and passes; H1 fixed in the page object, all specs using it re-run and listed; P1 checked frontmatter first, used the journey map from Task 5 (copied into the project) to pick the area and explored only that area live, plan in `specs/swag-labs/`, new docs with all five fields. Plus P2: same prompt with no journey map present → runs `mapping-site-journeys` first. Plus G2: same prompt as G1 in S-auto with decision `existing` → follows the existing raw style, no page objects imposed.
- [ ] **Step 3: Commit** (ask first). Message: `feat(skills): playwright skills follow the framework map`.

### Task 7: Routing check and final checks

**Files:** Modify `docs/superpowers/skill-tests/skill-descriptions.md` (append a 2026-11-12 round).

- [ ] **Step 1: Routing**, same method as the existing log (fresh `sonnet` subagents get only skill names + descriptions, 5 reps). Keep the old requests and add: "Set up a test framework for this new project" → `building-playwright-framework`; "Map how the tests in this repo are organised" → `mapping-existing-framework`; "We've never looked at this site before, investigate it" → `mapping-site-journeys`; "Write the test for scenario 2.1" → `generating-playwright-tests`; "The cart test fails locally" → `healing-playwright-tests`. Pass = every rep right; otherwise fix the description and re-run.
- [ ] **Step 2:** `git diff main --name-only` lists only paths allowed by Global Constraints; `git diff main -- .github` is empty.
- [ ] **Step 3:** Delete `<scratchpad>/fw/`.
- [ ] **Step 4: Commit** (ask first). Message: `test(skills): routing check for framework skills`.
- [ ] **Step 5:** Tell the user the branch is ready for the Swag Labs trial, list the commits (nothing pushed).
