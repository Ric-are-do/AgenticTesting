#!/usr/bin/env node
// Logs the token usage of every Claude API call in a run, so we can see what a job costs.
//
// Usage: node .github/scripts/log-claude-usage.mjs <messages-file> [label]
//
// <messages-file> is either:
//   - JSON lines from `claude -p --output-format stream-json --verbose`, or
//   - the JSON array claude-code-action writes to its `execution_file` output.
//
// Prints one row per API call (input, output, cache read, cache write tokens),
// the totals, and the cost Claude Code reports. Also writes the same table to the
// GitHub step summary when $GITHUB_STEP_SUMMARY is set. Never fails the job.
import { readFileSync, appendFileSync, existsSync } from 'node:fs';

const [file, label = 'Claude'] = process.argv.slice(2);

function readMessages(path) {
  const text = readFileSync(path, 'utf8').trim();
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    // JSON lines: skip any line that isn't JSON.
    return text.split('\n').flatMap((line) => {
      try { return [JSON.parse(line)]; } catch { return []; }
    });
  }
}

// One API response can arrive as several assistant messages (one per content
// block) with the same message.id and the same usage. Count each id once.
function perCallUsage(messages) {
  const calls = new Map();
  for (const m of messages) {
    if (m?.type !== 'assistant' || !m.message?.usage) continue;
    const id = m.message.id ?? m.uuid ?? `call-${calls.size}`;
    const u = m.message.usage;
    calls.set(id, {
      who: m.parent_tool_use_id ? 'subagent' : 'main',
      model: m.message.model ?? '?',
      input: u.input_tokens ?? 0,
      output: u.output_tokens ?? 0,
      cacheRead: u.cache_read_input_tokens ?? 0,
      cacheWrite: u.cache_creation_input_tokens ?? 0,
    });
  }
  return [...calls.values()];
}

function renderTable(label, calls, result) {
  const sum = (k) => calls.reduce((n, c) => n + c[k], 0);
  const n = (v) => v.toLocaleString('en-US');
  const lines = [
    `### Token usage: ${label}`,
    '',
    '| # | Who | Model | Input | Output | Cache read | Cache write |',
    '|---|-----|-------|------:|-------:|-----------:|------------:|',
    ...calls.map((c, i) =>
      `| ${i + 1} | ${c.who} | ${c.model} | ${n(c.input)} | ${n(c.output)} | ${n(c.cacheRead)} | ${n(c.cacheWrite)} |`),
    `| **Total** | | **${calls.length} calls** | **${n(sum('input'))}** | **${n(sum('output'))}** | **${n(sum('cacheRead'))}** | **${n(sum('cacheWrite'))}** |`,
    '',
  ];
  if (result) {
    const cost = typeof result.total_cost_usd === 'number' ? `$${result.total_cost_usd.toFixed(4)}` : 'not reported';
    lines.push(`Result: ${result.subtype ?? '?'}, turns: ${result.num_turns ?? '?'}, ` +
      `estimated cost (Claude Code's client-side estimate): ${cost}`);
  } else {
    lines.push('Result: no result message (the run was cut off), so the rows above may be incomplete.');
  }
  return lines.join('\n') + '\n';
}

function main() {
  if (!file || !existsSync(file)) {
    console.log(`No Claude output at '${file ?? ''}', so no token usage to log.`);
    return;
  }
  const messages = readMessages(file);
  const calls = perCallUsage(messages);
  const result = messages.findLast?.((m) => m?.type === 'result')
    ?? [...messages].reverse().find((m) => m?.type === 'result');
  const table = renderTable(label, calls, result);
  console.log(table);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, table + '\n');
}

try {
  main();
} catch (err) {
  console.log(`Could not log token usage: ${err.message}`);
}
