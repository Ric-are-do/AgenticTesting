# Playwright CLI vs MCP

Both let an AI drive a real browser. They differ in **how** the AI calls
Playwright.

## The difference

| | **CLI** (`playwright-cli`) | **MCP** (`playwright-test` server) |
|---|---|---|
| How Claude uses it | Runs shell commands through the Bash/PowerShell tool | Calls typed tools such as `browser_click` directly |
| Example | `playwright-cli open https://www.saucedemo.com` then `playwright-cli click e5` | `mcp__playwright-test__browser_click` with `{ element, ref }` |
| Connection | A command per action; state kept between commands by the CLI | A long-lived server process started from `.mcp.json` |
| Tool access | Whatever the shell allows | Only the tools an agent lists in its `tools:` line |
| Output | Text printed to the terminal; logs and snapshots saved to `.playwright-cli/` | Structured results returned straight to the model |
| Setup | `npm install -g @playwright/cli@latest`, plus a skill in `.claude/skills/` | `.mcp.json` entry, created by `npx playwright init-agents` |
| Test-specific tools | None | `planner_*`, `generator_*`, `test_run`, `test_debug` |
| Best for | Quick one-off browser tasks, scripts, low token use | Structured agent workflows that plan, write and heal tests |

**In short:** the CLI is a command you type (or Claude types for you). MCP is a
tool menu the model calls natively.

## Evidence that the agents use MCP, not the CLI

Open any file in [.claude/agents/](../.claude/agents/). The `tools:` line in the
front matter lists what the agent is allowed to use. For the planner:

```yaml
---
name: playwright-test-planner
tools: Glob, Grep, Read, LS, mcp__playwright-test__browser_click, mcp__playwright-test__browser_navigate, mcp__playwright-test__browser_snapshot, mcp__playwright-test__planner_setup_page, mcp__playwright-test__planner_save_plan, ...
---
```

What this shows:

1. **Every browser tool is prefixed `mcp__playwright-test__`.** That is the
   MCP server name from `.mcp.json`.
2. **No `Bash` or `PowerShell` tool is listed** for any of the three agents.
   Without a shell, an agent cannot run `playwright-cli` commands at all.
3. **The agents use tools that only the MCP server has.** `planner_save_plan`,
   `generator_write_test`, `test_run` and `test_debug` have no CLI equivalent.

Check it yourself:

```powershell
# MCP tools in each agent: expect many hits
Select-String -Path ".claude/agents/*.md" -Pattern "mcp__playwright-test__" -List

# Shell tools in each agent: expect no hits
Select-String -Path ".claude/agents/*.md" -Pattern "Bash|PowerShell|playwright-cli"
```

The server itself comes from `.mcp.json`:

```json
{ "mcpServers": { "playwright-test": {
    "command": "cmd", "args": ["/c", "npx", "playwright", "run-test-mcp-server"] } } }
```

## Where the CLI fits in this project

The CLI is the browser tool for all QA work. `.claude/skills/playwright-cli/`
teaches Claude to use it, and `.playwright-cli/` holds the logs and page
snapshots it saves.

- The four QA skills (`planning-playwright-tests`,
  `generating-playwright-tests`, `healing-playwright-tests` and
  `investigate-ci-failure`) all drive the browser with `playwright-cli`. None
  of them mention MCP.
- The `qa-tester` agent does its browser work through those skills, so it uses
  the CLI too.
- The three older agents (`playwright-test-planner`, `-generator`, `-healer`)
  are the only users of the MCP server. No skill or `qa-tester` refers to them.

## Two other Playwright MCP servers in this session

This session also has a separate `playwright` MCP server (tools named
`mcp__playwright__browser_*`) for general browser automation. The agents do not
use it. They are wired only to `mcp__playwright-test__*`.

## When to pick which

- **CLI (the default):** every QA workflow in this project: planning,
  generating, healing and CI investigation. The skills are built on it, it
  saves snapshots to files instead of filling the conversation, and it cost
  less in our measurements (about 14% cheaper on a multi-step flow, same
  quality, no difference on a single page). See
  [03-cli-vs-mcp-pricing.md](03-cli-vs-mcp-pricing.md).
- **MCP (the exception):** only the three older `playwright-test-*` agents, or
  an agent that has no shell. The server-only tools (`planner_save_plan`,
  `generator_write_test`, `test_run`, `test_debug`) are not needed by the
  skills: tests are written with the Write tool and run with
  `npx playwright test`.

**Cleanup candidates:** the three MCP agents in `.claude/agents/` and the
`playwright-test` entry in `.mcp.json` are no longer used by the QA workflow.
They have not been removed yet.
