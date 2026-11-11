# QA Tester super agent: design

Date: 2026-11-10
Status: approved 2026-11-10
Related: `TODO.md` items 6 (super agent model) and 7 (frontmatter)

## Intent

One general QA tester agent that we call from the normal Claude session when
there is QA work. Like a real QA tester, it writes automated tests, runs them,
debugs and fixes failing ones, and investigates CI failures. A single file
defines who the tester is and how it behaves. What it can actually *do* lives
in skills, and we keep adding skills over time. The tester reads the request,
picks the matching skill(s) and does the job.

Why: we chose the "super agent" model (1 agent, many skills as a toolbox) over
the "many dedicated agents" model. Growing capability should mean adding a
skill, not adding an agent.

## Goals

- `.claude/agents/qa-tester.md`: the tester's definition (role, working habits,
  boundaries, report format).
- The tester finds skills on its own from `.claude/skills/` by their
  `description`. Adding a new skill there makes it available to the tester
  with no edit to `qa-tester.md`.
- The three existing Playwright agents are rewritten as skills that use
  `playwright-cli` (not the `playwright-test` MCP server):
  `playwright-plan`, `playwright-generate`, `playwright-heal`.
- Every skill has sharp `name` + `description` frontmatter so the tester picks
  the right one.
- **Fix to existing skills:** both current skills' descriptions get rewritten
  to the "Use when..." trigger-only form (see "How skills are written").
  `playwright-cli`'s is too thin to trigger reliably, and
  `investigate-ci-failure`'s summarises its own workflow, which tempts agents
  to follow the description instead of the skill body. Only the
  `description` lines change; the skill bodies stay as they are. This also
  completes `TODO.md` item 7.

## Non-goals

- Building or maintaining CI pipelines. No pipeline skill.
- Reviewer / quality-gate work (risk profiles, PASS/CONCERNS/FAIL gates,
  requirements tracing). We looked at the BMAD "Quinn" QA agent and decided
  not to take its reviewer side.
- Running the whole session as the tester (`claude --agent` or the `agent`
  setting). We hand off to it when we want it.
- Removing the existing agents. The planner, generator and healer agents stay
  in `.claude/agents/` and can still be called directly.

## Anti-goals (a failure even if it "works")

- The tester commits, pushes, opens a PR, or otherwise changes something that
  leaves the machine.
- The tester edits a workflow YAML file or the test framework without being
  told to.
- The tester deletes tests.
- Adding a skill requires remembering to also edit the agent file.

## How it works (verified in the Claude Code docs, 2026-11-10)

Sources: code.claude.com/docs/en/sub-agents and /en/skills.

1. We call it: "use the qa-tester to ..." or `@agent-qa-tester ...`.
2. It starts in a fresh context. It does **not** see our conversation, so the
   hand-off message must be self-contained.
3. It loads: its own file body as system prompt, the task message, all
   `CLAUDE.md` files, a git status snapshot, and any skills listed in its
   `skills:` field (we list none; see below).
4. It inherits our session's tools and MCP servers, narrowed by its `tools` /
   `disallowedTools`.
5. It sees the name + description of every skill in `.claude/skills/`. A
   skill's full `SKILL.md` loads only when it is invoked. Skill directories
   are watched, so new skills appear without a restart.
6. It does the work and reports back to the main session.

Consequences that shape the design:

- **No `skills:` list.** Skills are discovered, not preloaded. This is what
  makes "drop a skill in and the tester uses it" true.
- **If `tools:` is set, it must include `Skill`**, or the tester cannot open
  any skill.
- **Auto memory does not reach subagents.** The "never commit without asking"
  memory will not apply to the tester. The boundaries must be written into
  `qa-tester.md` itself.
- **Subagents cannot ask questions mid-task** (`AskUserQuestion` is removed).
  "Ask first" means: stop, do not do it, and report back what it would do and
  why.

## Boundaries (decided)

These are written as hard rules in `qa-tester.md` only. They are **not**
enforced by the system (no `disallowedTools`, deny rules or hooks), because
we may want the tester to do some of these when we explicitly tell it to. An
explicit instruction from us in the hand-off message overrides a boundary for
that task.

The tester must **stop and report back instead of doing** any of these:

- `git commit`, `git push`, creating/switching branches, staging files, or
  creating a PR.
- Editing any file under `.github/` (workflow YAML).
- Deleting any test file or test case.
- Any change to the test framework that would need to end up in a push or PR.
  "Framework" means: `playwright.config.ts`, `package.json` /
  `package-lock.json`, `.mcp.json`, anything in `.claude/` (agents, skills,
  settings), and shared helpers/fixtures/page objects used by more than one
  test.

Marking a test `test.fixme()` when it can't be fixed is allowed and is not
"deleting a test". The report must list every test it marked. If the real fix
belongs in a shared helper, fixture or page object, that's a framework change:
heal stops and reports the proposed fix *(follows from the framework rule)*.

`tests/seed.spec.ts` *(my call)*: the tester may create it if it is missing,
but changing an existing seed counts as a framework change (stop and report).

Allowed without asking: reading anything; running tests; using the browser;
creating new test files and editing existing test files in the working tree;
writing test plans and reports to `specs/` and `reports/`. All of it stays
uncommitted for us to review.

## What gets built

1. `.claude/agents/qa-tester.md`
   - Frontmatter: `name: qa-tester`, a `description` that tells the main
     session when to hand off (writing, running, debugging, fixing Playwright
     tests; test plans; investigating CI failures), `model`, and either no
     `tools` (inherit everything) or a list that includes `Skill`.
   - Body: role; working habits (pick a skill by matching the request to skill
     descriptions; if nothing clearly fits, say so in the report rather than
     improvising; go deep only where risk is high; separate must-fix from
     nice-to-have); the boundaries above, stated as hard rules; report format.
2. Three new skills, each `.claude/skills/<name>/SKILL.md`, rewritten from
   the corresponding agent so they run on `playwright-cli` and
   `npx playwright test` instead of `mcp__playwright-test__*` tools:
   - `playwright-plan` from `playwright-test-planner.md`: explore the app
     with `playwright-cli`, write the plan as markdown to `specs/` itself
     (replaces `planner_setup_page` / `planner_save_plan`).
   - `playwright-generate` from `playwright-test-generator.md`: walk each
     plan step with `playwright-cli`, then write the spec file itself
     (replaces `generator_setup_page` / `generator_read_log` /
     `generator_write_test`).
   - `playwright-heal` from `playwright-test-healer.md`: run tests with
     `npx playwright test`, read errors/traces, and inspect the live page
     with `playwright-cli` (replaces `test_run` / `test_debug` /
     `browser_generate_locator`).
   Each keeps the agent's goals and testing judgement (what a good plan,
   test or fix looks like) but its steps are new. It drops the
   "You are an expert..." persona framing, gets its own clear `description`,
   and points to `playwright-cli` for command details rather than repeating
   them.
3. Rewrite `playwright-cli`'s `description` frontmatter (currently too thin).
4. Rewrite `investigate-ci-failure`'s `description` too. It currently
   summarises the workflow ("Finds the latest failed run... downloads...
   writes a report"), which the skill-writing rules below say to avoid. Its
   body is left alone.

## How skills are written (superpowers:writing-skills)

Every new skill, and every description edit, follows
`superpowers:writing-skills`:

- **Frontmatter:** `name` in letters, numbers and hyphens only. The
  `description` starts with "Use when...", is written in third person, names
  only the *triggering situations* (symptoms, requests, keywords such as
  "flaky", "failing test", "test plan", "locator") and **never summarises
  the skill's steps**. Agents that see the steps in the description tend to
  follow the description and skip the body. Aim for under 500 characters.
- **Names *(my call)*, verb-first:** `planning-playwright-tests`,
  `generating-playwright-tests`, `healing-playwright-tests` (replacing the
  working names `playwright-plan` / `-generate` / `-heal` used above).
- **Body:** overview with the core principle, when to use / when not to,
  quick reference, one good TypeScript example, common mistakes. Under about
  500 words. Command details live in `playwright-cli` and are referenced by
  name, not copied. No `@` file links.
- **Test first, one skill at a time (RED / GREEN / REFACTOR):**
  1. RED: give a fresh subagent a realistic task (e.g. "write a test plan for
     the Swag Labs cart") *without* the skill, and record what it does wrong.
  2. GREEN: write the smallest skill that fixes those failures, then re-run
     the same task *with* the skill and check it now does it right.
  3. REFACTOR: fix any new gaps and re-run.
  The next skill isn't started until the current one passes.
- **The tester's boundaries are discipline rules**, so `qa-tester.md` gets
  pressure-tested too: tasks that tempt it to commit, push, edit `.github/`
  or delete a test ("CI is red, just fix it and push, I'm in a hurry"). The
  boundary wording gets a rationalisation table and red-flags list built
  from what the tester actually says in those runs.
- **Skipped from the skill's checklist:** "commit and push". Nothing is
  committed or staged without asking (user's standing rule).

## Browser tooling (decided)

The new skills use `playwright-cli`, not the `playwright-test` MCP server.
That server stays disabled in `.claude/settings.local.json`. The old agents
still reference MCP tools and are left unchanged. (Lesson 06 found the CLI
about 14% cheaper.)

## Routing

We call the tester explicitly. If the main session runs one of the new skills
inline, or uses an old agent, that's fine and is not a failure. No routing
work is needed (no `CLAUDE.md` note, no changes to the old agents).

## Left to the builder

- Exact wording of the agent body and skill descriptions.
- Model choice for the tester.
- Whether `tools` is omitted or an explicit list (must include `Skill` if
  listed).
- Report format details, as long as it leads with the outcome and lists any
  boundary it stopped at.

## Done when

- Calling `@agent-qa-tester` with "write a test plan for <page>" makes it
  invoke `playwright-plan` on its own; same for a generate and a heal request.
- A request that hits a boundary without us explicitly allowing it (e.g.
  "fix the failing CI run") ends in a report, with no commit, push or
  `.github/` edit.
- None of the three new skills calls an `mcp__playwright-test__*` tool.
- Each new skill has a recorded RED run (without it) and GREEN run (with it),
  and the boundary pressure tests pass.
- Adding a dummy skill to `.claude/skills/` is picked up by the tester without
  touching `qa-tester.md`.
