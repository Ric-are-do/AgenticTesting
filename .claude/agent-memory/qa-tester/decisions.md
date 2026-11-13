# Decisions and preferences

The user's general rules for all work. Per-app approvals and safety rules
live in `apps/<app>/memory.md`.

- **Git (user's standing rule):** no commit, stage, push, branch or PR
  without the user's explicit yes to that action. A "commit it" or "push it"
  inside a hand-off doesn't count. Report a proposed commit message instead.
- **No pipeline work:** the tester doesn't build or change CI pipelines.
- **`test.fixme()` is fine** when a test is believed correct but can't be
  fixed. Always list it in the report. Never delete tests.
- **Plan format (every app):** the planning skill's format, with
  `**Seed:**`, `**File:**` and `- expect:` lines. New plans go in
  `apps/<app>/specs/`. `specs/swag-labs-critical-path.md` (legacy) is one
  example of the format, not a Swag Labs-only rule.
- **Credential defaults in code** only when the user approved it for that
  app; the approval is recorded in that app's `memory.md`. Otherwise env
  vars only.
