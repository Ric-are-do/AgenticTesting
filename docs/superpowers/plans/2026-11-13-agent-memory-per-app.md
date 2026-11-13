# Agent memory per app Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the qa-tester's memory into general files plus one subfolder per app, and point the agent and skills at it.

**Architecture:** Markdown only. General notes stay in `.claude/agent-memory/qa-tester/`; app notes move to `.claude/agent-memory/qa-tester/apps/<app>/memory.md`, indexed from `MEMORY.md`. The agent file and three skills change their references.

**Tech Stack:** Markdown, `grep` for checks.

**Spec:** `docs/superpowers/specs/2026-11-13-agent-memory-per-app-design.md`

## Global Constraints

- No secrets in any memory file (name the variable, never the value).
- Never edit `.github/`. No `git add`/`commit`/`push` without the user's explicit yes (user CLAUDE.md); "Commit" steps below mean *ask*.
- Per-app `memory.md` frontmatter: `app`, `description`, `updated`. Sections in this order: `## Rules and approvals`, `## Quirks and possible bugs`, `## Docs`.
- `MEMORY.md` app line format: `- <app> → apps/<app>/memory.md: <one-line hook>`.
- Lessons are history: add a dated "Changed 2026-11-13" note, don't rewrite.

## Review Focus

1. A safety rule lost in the move (the qa-practice contact form): it must exist in `apps/qa-practice/memory.md` and nowhere be dropped. Check in Task 1.
2. An app note left behind in a general file (`decisions.md`, `MEMORY.md`, `framework-map.md`). Check in Task 1 with grep.
3. A skill still telling the agent to write to `app-knowledge.md` or record approvals in `decisions.md`. Check in Task 2 with grep.
4. A fresh agent not knowing to read the app memory: the rule must be in both `MEMORY.md` (auto-loaded) and the agent file. Check in Task 2.
5. Removing an app leaving memory behind: the add/remove rule must name the subfolder and the index line. Check in Task 2.

---

### Task 1: Restructure the memory folder

**Files:**
- Create: `.claude/agent-memory/qa-tester/apps/swag-labs/memory.md`, `.claude/agent-memory/qa-tester/apps/qa-practice/memory.md`
- Delete: `.claude/agent-memory/qa-tester/app-knowledge.md`
- Modify: `.claude/agent-memory/qa-tester/MEMORY.md`, `decisions.md`, `environment.md:17-18`, `framework-map.md:35`

**Interfaces:**
- Produces: the paths `apps/<app>/memory.md` and the `## Apps` section in `MEMORY.md`, used by Task 2.

- [ ] **Step 1: Check the starting state fails the target**

Run: `grep -rn "app-knowledge\|qa-practice\|Swag Labs\*\*" .claude/agent-memory/qa-tester/MEMORY.md .claude/agent-memory/qa-tester/decisions.md`
Expected: matches (app notes still in general files).

- [ ] **Step 2: Create `apps/swag-labs/memory.md`**

Rules and approvals: credential defaults approved 2026-11-12 (from `decisions.md`). Quirks and possible bugs: the five notes from `app-knowledge.md` (login button, empty-cart checkout, cart without login, cart persists, product link) plus the legacy seed note. Docs: none yet (tests are legacy in `tests/swag Lab tests/`).

- [ ] **Step 3: Create `apps/qa-practice/memory.md`**

Rules and approvals: never submit the home page contact form (real form service); the `/qa-practice` practice forms are client-side only. Quirks: none kept (app removed 2026-11-13 for a re-run). Docs: none (app folder removed).

- [ ] **Step 4: Update the general files**

`decisions.md`: drop the "Credential defaults" and "Site safety" sections; add one line: "Per-app approvals and safety rules live in `apps/<app>/memory.md`." `environment.md`: replace the OneDrive bullet with "Paths contain spaces (`tests/swag Lab tests/`, `lessons learned/`). Quote paths." `framework-map.md:35`: "approved in `decisions.md`" → "approved in the app's memory (`apps/<app>/memory.md`)". Delete `app-knowledge.md`. `MEMORY.md`: replace "App knowledge" with `## Apps` (rule line: "Before working on an app, read its `apps/<app>/memory.md`. Adding or removing an app adds or removes its subfolder and its line here.", then the two app lines); remove the two app lines from "Decisions".

- [ ] **Step 5: Verify**

Run: `grep -rln "app-knowledge" .claude/agent-memory/; grep -n "qa-practice\|Swag Labs" .claude/agent-memory/qa-tester/decisions.md .claude/agent-memory/qa-tester/environment.md; grep -n "contact form" .claude/agent-memory/qa-tester/apps/qa-practice/memory.md; ls .claude/agent-memory/qa-tester/apps`
Expected: first two print nothing; the contact-form line is found; `qa-practice  swag-labs`.

- [ ] **Step 6: Ask the user before any commit.**

### Task 2: Point the agent, skills and docs at the new layout

**Files:**
- Modify: `.claude/agents/qa-tester.md:53-80`, `.claude/skills/building-playwright-framework/SKILL.md:41-43`, `.claude/skills/building-playwright-framework/fixtures-and-config.md:83-85`, `.claude/skills/mapping-site-journeys/SKILL.md:56`, `README.md:39-41`, `lessons learned/12-agent-memory.md` (note near line 93), `lessons learned/14-skill-test-framework-skills.md:110,226-227`, `TODO.md:23-29`

**Interfaces:**
- Consumes: Task 1's paths and `## Apps` section.

- [ ] **Step 1: Check references fail the target**

Run: `grep -rn "app-knowledge\|decisions\.md" .claude/agents .claude/skills README.md`
Expected: matches.

- [ ] **Step 2: Agent file.** Memory section: general files vs `apps/<app>/memory.md`; before working on an app read its memory; app notes never go in general files; add/remove an app → subfolder + `MEMORY.md` line. Table: drop `app-knowledge.md`, add `apps/<app>/memory.md` ("that app's rules, approvals, quirks, and pointers to its docs"); `decisions.md` = "the user's general rules".

- [ ] **Step 3: Skills.** Building `SKILL.md` step 4 and `fixtures-and-config.md` Secrets: approvals are checked in and recorded to `apps/<app>/memory.md` in the agent's memory. Mapping-site-journeys step 4: add the pointer to the app's memory file `## Docs` (create the subfolder and the `MEMORY.md` line if missing).

- [ ] **Step 4: Docs.** README memory paragraph mentions general + per-app subfolders. Lesson 12: "Changed 2026-11-13" note that app notes now live in `apps/<app>/memory.md`. Lesson 14 line 110 and 226-227: same note. TODO item 6: mark `[x]` with a one-line summary; keep "shared across repos" as still open.

- [ ] **Step 5: Verify**

Run: `grep -rn "app-knowledge" .claude/agents .claude/skills README.md; grep -rn "decisions\.md" .claude/skills; grep -n "apps/<app>/memory.md" .claude/agents/qa-tester.md .claude/agent-memory/qa-tester/MEMORY.md .claude/skills/mapping-site-journeys/SKILL.md .claude/skills/building-playwright-framework/SKILL.md`
Expected: first two print nothing; the last finds a line in each of the four files.

- [ ] **Step 6: Ask the user before any commit.**
