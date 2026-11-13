# TODO

Open this first when we start working again.

## Next up

1. [x] **Test the overall flow end to end,** and understand the YAML files and
   the flow logic better. *(Reminder to myself.)*
   - Start with the diagrams in `lessons learned/08-ci-investigator.md`.
   - The files: `.github/workflows/playwright.yml`, `claude.yml` and
     `investigate-ci.yml`.
2. [ ] **Implement a self-learning mechanism.** Build it up from reviews, like
   a lessons-learned log, basically like the memory file the agent uses.
   *(Started 2026-11-10: qa-tester has `memory: project` in
   `.claude/agent-memory/qa-tester/`, seeded with what we learned. Still to
   do: test it with two calls (save, then recall), and decide whether review
   findings should feed into it.)*
3. [ ] **Confirm API testing in the framework skill.** Check whether
   `building-playwright-framework` covers API tests, and how.
4. [ ] **Confirm contract testing.** Check whether the framework covers
   contract tests, and how.
5. [ ] **Set up a site skill for exploratory testing.**

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
