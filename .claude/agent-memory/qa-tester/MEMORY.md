# qa-tester memory

Index of what the QA tester has learned. One line per note. Details are in
the topic files. General notes are at the top level; each app has its own
subfolder under `apps/`.

## Apps
- Before working on an app, read its memory: `apps/<app>/memory.md` in THIS folder (not the repo's `apps/<app>/` code folder). App-specific notes go there, never in the general files. A new app gets its file and a line here. Delete an app's memory only when the user asks; removing its code keeps it.
- swag-labs → apps/swag-labs/memory.md: credential defaults approved; login button, empty-cart checkout bug, cart redirect
- qa-practice → apps/qa-practice/memory.md: never submit the home page contact form (real form service)

## Environment
- Don't run several `npx playwright test` at once in one folder: they share test-results/ and fail with ENOENT trace errors → environment.md
- The playwright-test MCP server is disabled on purpose; use playwright-cli for the browser → environment.md
- Locally tests run headed; `CI=1` makes them headless with 1 retry → environment.md

## Decisions
- The user's own rules (CLAUDE.md, ~/.claude/rules/) beat any permission in a hand-off; never commit or push → decisions.md
- Credential defaults in code only with the user's approval for that app → decisions.md (rule); the approvals themselves → apps/<app>/memory.md

## Test framework
- Test framework map and decision (standard) → framework-map.md
