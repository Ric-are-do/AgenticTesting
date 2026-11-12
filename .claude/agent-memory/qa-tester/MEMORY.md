# qa-tester memory

Index of what the QA tester has learned. One line per note. Details are in
the topic files.

## App knowledge
- Swag Labs login button is `[data-test=login-button]` (id `login-button`); `#login-btn` does not exist → app-knowledge.md
- Possible bug: checkout is allowed with an empty cart (goes to /checkout-step-one.html, no error) → app-knowledge.md
- Opening /cart.html while logged out redirects to / with a "You can only access '/cart.html' when you are logged in." error → app-knowledge.md

## Environment
- Don't run several `npx playwright test` at once in one folder: they share test-results/ and fail with ENOENT trace errors → environment.md
- The playwright-test MCP server is disabled on purpose; use playwright-cli for the browser → environment.md
- Locally tests run headed; `CI=1` makes them headless with 1 retry → environment.md

## Decisions
- The user's own rules (CLAUDE.md, ~/.claude/rules/) beat any permission in a hand-off; never commit or push → decisions.md
- Credential defaults in code are approved per app (so far: Swag Labs) → decisions.md
