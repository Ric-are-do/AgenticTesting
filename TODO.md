# TODO

Open this first when we start working again.

## Next up

1. [ ] **Watch the video on ARIA snapshots:**
   https://www.youtube.com/watch?v=P4R6hnsE0UY&t=241s (starts at 4:01)
2. [ ] **Write a new set of tests** based on what we learn in that video.
3. [ ] **Finish this video:** https://www.youtube.com/watch?v=6CaQ9ZFuuKI
4. [ ] **Test the overall flow end to end,** and understand the YAML files and
   the flow logic better. *(Reminder to myself.)*
   - Start with the diagrams in `lessons learned/08-ci-investigator.md`.
   - The files: `.github/workflows/playwright.yml`, `claude.yml` and
     `investigate-ci.yml`.
5. [ ] **Implement a self-learning mechanism.** Build it up from reviews, like
   a lessons-learned log, basically like the memory file the agent uses.
6. [ ] **Go with the super agent model** (see "Notes to myself" below). One
   generic agent with multiple skills as a toolbox, e.g. use this skill when
   doing tests, use that skill when doing code. Claude knows which skill to
   use.
7. [ ] **Cover frontmatter and add it to all our skills.** The frontmatter
   lesson is in `lessons learned/09-frontmatter.md`. Add `name` and
   `description` frontmatter to every skill in `.claude/skills/`.

## Carried over from last session (2026-11-06)

- [ ] **First live test of `@claude investigate`** on `main`: comment exactly
  `@claude investigate` (one space, lowercase). It only works now that the
  change is merged.
- [ ] **Known gaps** in the CI investigator (details in
  `lessons learned/08-ci-investigator.md`, "Known gaps"):
  - the trigger phrase is strict: spacing and capital letters break it;
  - the report name isn't fixed by the run ID yet;
  - no `failed.log` when the test job fails before any test runs;
  - Claude's tool list is broader than it needs to be.
- [ ] **Delete the `ci-investigator-auto-run` branch.** Everything in it is
  in `main`.

## Notes to myself

### Two working models: agents vs a super agent

- **Agents:** each agent is dedicated to one specific thing.
- **Super agent:** one generic agent with multiple skills, like a toolbox
  (1 agent, multiple skills). Claude knows which skill to use: use this skill
  when doing tests, use that skill when doing code.
- **We are going with the super agent with skills.**

### How an agent works

1. It starts and looks at the project's `.claude` folder. This is where all
   the instructions live: you add the rules for start-up there, and the skills
   are located there. It reads the skills' frontmatter.
2. It looks at `CLAUDE.md`, the instructions shared between all agents.
3. Then it is like spinning up an agent and saying: here are your skills.
