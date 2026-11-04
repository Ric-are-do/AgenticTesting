# Getting Started: Playwright + Claude Code Agents

> **Note:** These commands are reconstructed from what is on disk (`package.json`,
> `.mcp.json`, `.claude/agents/`, `.claude/skills/`), not from shell history.
> Check them against what you actually typed. Versions are the ones installed
> when this was written: `@playwright/test` 1.64.1, `playwright-cli` 0.1.23.

## 1. Create the project and install Playwright

```powershell
mkdir AgenticTesting
cd AgenticTesting
npm init -y
npm init playwright@latest
```

The installer asks a few questions (TypeScript, tests folder, GitHub Actions
workflow, browsers). It produced:

- `playwright.config.ts`
- `tests/example.spec.ts`
- `.github/workflows/`
- `@playwright/test` in `devDependencies`

If the browsers were not downloaded, run:

```powershell
npx playwright install
```

## 2. Generate the Playwright agents for Claude Code

```powershell
npx playwright init-agents --loop=claude
```

This created:

| Created | Purpose |
|---|---|
| `.claude/agents/playwright-test-planner.md` | Explores the site and writes a test plan |
| `.claude/agents/playwright-test-generator.md` | Turns a plan item into a `.spec.ts` file |
| `.claude/agents/playwright-test-healer.md` | Debugs and fixes failing tests |
| `.mcp.json` | Registers the `playwright-test` MCP server |
| `specs/README.md` | Folder where test plans are saved |
| `tests/seed.spec.ts` | Seed test that sets up the page for the agents |

The MCP server entry in `.mcp.json` (Windows form):

```json
{
  "mcpServers": {
    "playwright-test": {
      "command": "cmd",
      "args": ["/c", "npx", "playwright", "run-test-mcp-server"]
    }
  }
}
```

Restart Claude Code (or reload the VS Code window) after this so it picks up the
new agents and MCP server.

## 3. (Optional) Playwright CLI and its skill

The project also has `.claude/skills/playwright-cli/` and a `.playwright-cli/`
folder of logs and page snapshots. That comes from the standalone CLI:

```powershell
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

See [02-cli-vs-mcp.md](02-cli-vs-mcp.md) for why this is separate from the agents.

## 4. Project layout for the Swag Labs work

```
AgenticTesting/
├── .claude/agents/          # planner, generator, healer
├── .mcp.json                # playwright-test MCP server
├── specs/                   # test plans (swag-labs-critical-path.md)
├── tests/
│   ├── seed.spec.ts
│   └── swag Lab tests/      # seed + generated specs for saucedemo.com
└── playwright.config.ts
```

## 5. The workflow we used

1. **Plan:** ask the `playwright-test-planner` agent to explore
   https://www.saucedemo.com/ and save a plan to `specs/`.
2. **Generate:** ask `playwright-test-generator` to write one test per plan
   item. Run one generator at a time (see lessons below).
3. **Run:**

   ```powershell
   # everything in the folder, all three browsers
   npx playwright test "tests/swag Lab tests"

   # one browser, readable output
   npx playwright test "tests/swag Lab tests" --project=chromium --reporter=list

   # open the HTML report
   npx playwright show-report
   ```

4. **Heal:** if a test fails later, ask `playwright-test-healer` to fix it.

## Lessons learned

- **Run generator agents one at a time.** They share one browser through the
  MCP server. Two at once collided, and both reported failed setups.
- **A generator's "done" is not "passing".** Agents often only partly verify
  assertions live. Always run the spec yourself.
- **Quote paths with spaces.** `"tests/swag Lab tests"` needs the quotes in the
  shell.
- **`headless: false`** is set in `playwright.config.ts`, so runs open visible
  browser windows.
