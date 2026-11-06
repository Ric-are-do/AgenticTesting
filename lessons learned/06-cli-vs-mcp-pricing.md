# Playwright CLI vs MCP: Pricing Difference

We measured what the CI failure investigator costs when Claude drives the
browser with **Playwright CLI** (`playwright-cli`) versus the **Playwright MCP**
server (`@playwright/mcp`). Same skill, same evidence, same prompt. The only
thing that changed was the browser tool.

Measured on 2026-11-06 with Claude Opus 5.5 and Claude Code CLI 2.1.319.

## Short answer

- **One page to check:** no real difference (CLI $0.43, MCP $0.42 per run).
- **A multi-step flow:** the CLI was about **14% cheaper** ($0.54 vs $0.63 per
  run) and used about **5 fewer turns**.
- **Quality:** the same. All 10 runs reached the correct diagnosis.
- **Decision:** keep `playwright-cli` in the investigator.

## Why the CLI can be cheaper

- **MCP:** after every action (navigate, click, fill), the tool returns the full
  page snapshot into the conversation. It stays in the context, so every later
  turn re-reads it.
- **CLI:** each command prints a short line and saves the snapshot to a file in
  `.playwright-cli/`. Claude only reads a snapshot when it needs one.

So the gap grows with the number of browser steps. With a single page there is
almost nothing to save.

## How we measured

- **Simple failure:** live CI run `42265467750` (PR #9). The test
  `tmp-fail.spec.ts` expects the saucedemo title `Nope`, and the real title is
  `Swag Labs`. The live check is one page.
- **Multi-step failure:** a temporary local test. It logs in, adds 2 items,
  opens the cart, checks out, fills the form, then expects `Item total: $40.00`.
  The real total is `$39.98`. The live check walks 6 pages.
- **3 runs per mode per scenario,** alternating CLI and MCP so that time-of-day
  effects even out.
- **Each run** was `claude -p` with `--output-format json` (which reports cost,
  turns and tokens) and `--max-turns 50`.
  - `--strict-mcp-config` made sure only the browser tool under test was loaded.
    The CLI run had no MCP servers. The MCP run had only `@playwright/mcp`.
  - Every run got its own copy of the evidence.
- **The prompt** told Claude to "do the live site check fully: walk the whole
  flow in the test up to the failing step". Without that it might have skipped
  the browser, because `error-context.md` often explains the failure on its own.

## Results

Averages (n = 3 per row). Cost is the list-price equivalent.

| Scenario | Mode | Avg cost | Range | Avg turns | Avg tokens read from cache | Avg output tokens | Avg time |
|---|---|---|---|---|---|---|---|
| Simple | CLI | $0.428 | $0.367–0.499 | 15.7 | 447k | 5.0k | 77 s |
| Simple | MCP | $0.419 | $0.389–0.439 | 16.7 | 371k | 4.8k | 69 s |
| Multi-step | CLI | **$0.542** | $0.489–0.611 | **20.3** | 703k | 5.6k | 90 s |
| Multi-step | MCP | **$0.628** | $0.600–0.682 | **25.3** | 814k | 6.6k | 105 s |

Every run:

| Run | Cost | Turns | Tokens read from cache | Output tokens | Time | Live site check |
|---|---|---|---|---|---|---|
| simple CLI 1 | $0.418 | 16 | 410k | 4.7k | 73 s | Reached |
| simple MCP 1 | $0.430 | 20 | 365k | 5.4k | 74 s | Reached |
| simple CLI 2 | $0.499 | 18 | 547k | 6.2k | 84 s | Reached |
| simple MCP 2 | $0.439 | 16 | 391k | 4.4k | 60 s | Reached |
| simple CLI 3 | $0.367 | 13 | 384k | 4.3k | 75 s | Reached |
| simple MCP 3 | $0.389 | 14 | 356k | 4.6k | 73 s | Reached |
| multi-step CLI 1 | $0.611 | 29 | 967k | 6.3k | 91 s | Reached |
| multi-step MCP 1 | $0.603 | 26 | 664k | 6.7k | 96 s | Differs from screenshots |
| multi-step CLI 2 | $0.489 | 17 | 592k | 5.6k | 100 s | Reached |
| multi-step MCP 2 | $0.600 | 23 | 753k | 6.1k | 80 s | Reached (report misnamed, see below) |
| multi-step CLI 3 | $0.527 | 15 | 549k | 5.0k | 80 s | Reached (report misnamed, see below) |
| multi-step MCP 3 | $0.682 | 27 | 1,024k | 7.0k | 140 s | Reached |

All 12 runs gave the right answer:
- simple: "Test is wrong", the title is `Swag Labs`
- multi-step: "Test is wrong", the total is $29.99 + $9.99 = $39.98

Total spent on the comparison: about $6 in list-price terms.

## What we learned

1. **The browser is only a small part of the bill.** Most tokens go on the skill
   instructions, `results.json`, `error-context.md`, the test source and
   `git diff`, and those cost the same either way. Swapping the browser tool
   only changes the browser part.
2. **The CLI wins as flows get longer.** All three MCP multi-step runs cost
   $0.60 or more, while two of the three CLI runs came in under that. Real
   CI failures are often deep in a flow, which is where the CLI helps.
3. **Runs vary a lot.** The same setup ranged by up to 35% (simple CLI
   $0.37–0.50), because Claude doesn't take the same path every time. One run
   per mode would have shown nothing. Use at least 3.
4. **The model matters far more than the tool.** These were Opus runs. A
   cheaper model (for example `--model sonnet` on the CI step) would likely cut
   the cost by several times, much more than CLI vs MCP. That hasn't been
   measured yet.
5. **`claude-code-action` vs the Claude Code CLI** is not mainly about price.
   The action runs the same Claude Code underneath and adds a few GitHub MCP
   tools and a longer system prompt, which is small and mostly cached. We
   switched because the action rejects `push` events
   (`Unsupported event type`), so failed runs on `main` could never be
   investigated.
6. **On CI, the dollar figures are only a guide.** The workflow signs in with
   `CLAUDE_CODE_OAUTH_TOKEN`, so runs count against the Claude plan's usage
   limits rather than being billed per token.

## A bug the runs found

2 of the 12 runs saved the report as `reports/ci-failure-local.md` instead of
using the run ID from the evidence folder name. In CI that would leave the real
report under the wrong name. The fallback step would then also write a
misleading "investigation did not finish" report.

Fix (not yet applied): pass `run id <id>` explicitly in the investigator prompt
and have the skill use it for the file name.

## How to repeat this

The scripts are in `.superpowers/sdd/2026-11-06-ci-investigator-auto-run/`,
which git ignores, so they are not in the repo:
- `cmp-run.sh SRC_DIR LABEL N "extra prompt"` runs N CLI/MCP pairs.
- Results are appended to `cmp-results.tsv`.

The key flags:

```bash
# CLI run: no MCP servers at all
claude -p "<prompt> Use playwright-cli for the browser." --output-format json --max-turns 50 \
  --strict-mcp-config --mcp-config mcp-none.json \
  --allowedTools "Read,Write,Edit,Glob,Grep,Bash(gh run:*),Bash(git log:*),Bash(git diff:*),Bash(git show:*),Bash(playwright-cli:*)"

# MCP run: only the Playwright MCP server
#   mcp-pw.json = {"mcpServers":{"playwright":{"command":"npx","args":["@playwright/mcp@latest","--headless"]}}}
claude -p "<prompt> Use the Playwright MCP tools (mcp__playwright__*) instead of playwright-cli." --output-format json --max-turns 50 \
  --strict-mcp-config --mcp-config mcp-pw.json \
  --allowedTools "Read,Write,Edit,Glob,Grep,Bash(gh run:*),Bash(git log:*),Bash(git diff:*),Bash(git show:*),mcp__playwright"
```

Read `total_cost_usd`, `num_turns` and `usage` from the last line of the JSON
output.

See also [02-cli-vs-mcp.md](02-cli-vs-mcp.md) for how the two tools differ in
use.
