# Environment

- **Parallel test runs clash.** Several `npx playwright test` runs at once in
  the same folder share `test-results/` and wipe each other's trace files.
  This shows up as `ENOENT ... .playwright-artifacts-0/traces/...`, not as a
  test failure. Run them one at a time, and don't "fix" it with
  `--trace=off`.
- **Browser tool:** the `playwright-test` MCP server is disabled in
  `.claude/settings.local.json` on purpose. Use `playwright-cli` (globally
  installed). A "playwright MCP CONNECT_TIMEOUT" message is expected; it
  isn't a reason to skip live inspection.
- **Headed vs headless:** locally tests run headed (`headless: !!process.env.CI`).
  `CI=1` switches to headless, 1 retry and fewer workers, so say so if you use it.
- **The HTML reporter** can keep a run open after a failure (it serves the
  report). `PLAYWRIGHT_HTML_OPEN=never` stops that without changing what is
  tested.
- **Paths contain spaces** (`tests/swag Lab tests/`, `lessons learned/`).
  Quote paths.
