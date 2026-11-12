# Logging Token Usage in CI: What Each Claude Call Costs

How we made every Claude job on GitHub log the tokens used by each API call,
so we can see what the investigator, `@claude` and the code review actually
cost. Follows on from [03-cli-vs-mcp-pricing.md](03-cli-vs-mcp-pricing.md)
and [08-ci-investigator.md](08-ci-investigator.md).

Sources:

- [Run Claude Code programmatically](https://code.claude.com/docs/en/headless)
  (Claude Code docs), for `--output-format stream-json`
- [claude-code-action](https://github.com/anthropics/claude-code-action):
  `action.yml` and `base-action/src/execution-file.ts`, for the
  `execution_file` output

## Why

A Claude job isn't one call. The agent loops: it calls the model, runs a
tool, calls the model again with the result, and so on. A 30-turn
investigation is about 30 API calls, each with its own token count. To find
out what's expensive, you need the numbers **per call**, not just one total.

## The four token numbers

Every API response has a `usage` object:

| Field | What it is | Cost |
|-------|------------|------|
| `input_tokens` | New input the model hadn't seen cached | Full input price |
| `output_tokens` | What the model wrote | The most expensive per token |
| `cache_read_input_tokens` | Input reused from the prompt cache (the system prompt, earlier turns) | About a tenth of the input price |
| `cache_creation_input_tokens` | Input written to the cache for next time ("cache write") | A bit more than the input price |

You asked for input, output and cache read. We added **cache write** too,
because you pay for it and it's often big on the first call.

How to read them: in a healthy run, `cache read` grows each call (the
conversation is reused) while `input` stays small. Big `input` on every call
means caching isn't working. Big `output` means the agent is writing a lot.

## Where the numbers come from

Our jobs run Claude in two different ways, so the usage comes from two places:

| Job | How Claude runs | Where the usage is |
|-----|-----------------|--------------------|
| Investigator (`investigate-ci.yml`) | The `claude` CLI | `--output-format stream-json --verbose` prints every message as one JSON line. Each `assistant` message has `message.usage`. |
| `@claude` (`claude.yml`) and code review (`claude-code-review.yml`) | `claude-code-action` | The action saves every message to a file and gives its path as the `execution_file` output: a JSON array of the same messages. |

The last message in both is a `result` message with `num_turns` and
`total_cost_usd`.

## What we built

**One shared script, `.github/scripts/log-claude-usage.mjs`.** It reads
either format and prints a table to the job log and the job summary page:

```
### Token usage: CI investigator

| # | Who      | Model             | Input | Output | Cache read | Cache write |
|---|----------|-------------------|------:|-------:|-----------:|------------:|
| 1 | main     | claude-sonnet-5-5 |    12 |    340 |          0 |      18,000 |
| 2 | subagent | claude-haiku-5-5  |     5 |     90 |     18,000 |         400 |
| **Total** | | **2 calls**      | **17**| **430**| **18,000** | **18,400**  |

Result: success, turns: 2, estimated cost (Claude Code's client-side estimate): $0.0712
```

(That's the test data, not a real run.)

**A "Log Claude token usage" step in each job**, right after Claude runs:

- It runs with `always()`, so it logs even when Claude failed or hit a limit.
- It has `continue-on-error: true`, and the script never exits with an
  error, so logging can never turn a job red.
- The file path is passed through `env:`, not pasted into the script with
  `${{ }}`, which is the safe way to use values in a `run:` step.

Node, not `jq`, because Node is on every GitHub runner *and* on this machine,
so we could test it here. `jq` isn't installed locally.

## Gotchas we hit or avoided

- **One call can show up as several messages.** The CLI can send one
  `assistant` message per content block (text, then a tool call), each
  repeating the same usage. Adding them all would double count. The script
  counts each `message.id` once.
- **Write the stream to a file, and read it in a separate step.** If the
  investigator hits its 10-minute step timeout, the step is killed. Because
  `stream-json` writes each message as it happens, `claude-stream.jsonl`
  still holds every call made before the cut-off, and the next step logs
  them. It then notes "no result message (the run was cut off)".
- **You lose the live text.** With `stream-json`, the log no longer shows
  Claude's answer as it runs. The usage step prints the final answer
  afterwards.
- **Subagent calls are labelled.** Messages from a subagent carry a
  `parent_tool_use_id`, so the table marks them "subagent" vs "main".
- **The cost is an estimate.** `total_cost_usd` is Claude Code's own
  calculation at API prices. We use a subscription token (OAuth), so it's not
  your bill. Use it to compare runs, not to predict the invoice.
- **`claude.yml` runs from `main`.** Comment events check out the default
  branch, so `@claude` only logs usage once this change is merged.

## How we tested it

On sample files built to look like both formats: a repeated message
(counted once), a subagent call, a non-JSON line (skipped), a cut-off run with
no result, a missing file (logs a note, exits 0), and the job summary file
(written). All four workflow files were checked to still parse as YAML.

**Not tested yet:** a real GitHub run. The first real investigator run is the
real test. Look for the table on the run's summary page.

## Where things live

```
.github/
  scripts/
    log-claude-usage.mjs     the shared logger
  workflows/
    investigate-ci.yml       stream-json to claude-stream.jsonl + usage step
    claude.yml               usage step after claude-code-action
    claude-code-review.yml   usage step after claude-code-action
```
