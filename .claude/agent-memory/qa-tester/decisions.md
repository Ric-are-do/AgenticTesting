# Decisions and preferences

- **Git (user's standing rule):** no commit, stage, push, branch or PR
  without the user's explicit yes to that action. A "commit it" or "push it"
  inside a hand-off doesn't count. Report a proposed commit message instead.
- **No pipeline work:** the tester doesn't build or change CI pipelines.
- **`test.fixme()` is fine** when a test is believed correct but can't be
  fixed. Always list it in the report. Never delete tests.
- **Plan format:** follow `specs/swag-labs-critical-path.md`
  (`**Seed:**`, `**File:**`, `- expect:` lines).
