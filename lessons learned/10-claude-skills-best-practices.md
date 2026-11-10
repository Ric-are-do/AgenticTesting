# Claude Skills: Best Practices

How to write skills that Claude can find and use well. This follows on from
[09-frontmatter.md](09-frontmatter.md), which covers the frontmatter itself.

Source: [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
(Claude docs).

Good skills are **concise, well-structured and tested with real usage.**

## Core principles

### 1. Be concise

The context window is shared with the system prompt, the conversation, other
skills' metadata and the user's request. At startup only each skill's `name`
and `description` are loaded. But once `SKILL.md` is loaded, every token in
it competes with everything else.

**Assume Claude is already very smart.** Only add what it doesn't know. For
each paragraph ask:

- Does Claude really need this explanation?
- Can I assume Claude already knows this?
- Does this paragraph justify its token cost?

Example: "Use pdfplumber for text extraction" plus a short code block (about 50
tokens) beats a paragraph explaining what a PDF is (about 150 tokens).

### 2. Match the freedom to the task

| Freedom | Use when | Looks like |
|---|---|---|
| **High** | Many approaches are valid; context decides | Text instructions, e.g. a code review process |
| **Medium** | There is a preferred pattern; some variation is fine | Pseudocode or a script with parameters |
| **Low** | The operation is fragile; consistency is critical | "Run exactly this script. Do not add flags." |

The analogy: a **narrow bridge with cliffs** needs exact guardrails (low
freedom, e.g. a database migration). An **open field** just needs a
direction (high freedom, e.g. a code review).

### 3. Test with every model you will use

What works for a powerful model may need more detail for a small one.

- **Haiku:** is there enough guidance?
- **Sonnet:** is it clear and efficient?
- **Opus:** does it avoid over-explaining?

## Skill structure

### Frontmatter

Two required fields, `name` and `description`. The rules are in
[09-frontmatter.md](09-frontmatter.md).

### Naming

Use one consistent pattern across all skills. The docs prefer the **gerund
form** (verb + -ing): `processing-pdfs`, `testing-code`,
`writing-documentation`.

Acceptable alternatives are noun phrases (`pdf-processing`) or action names
(`process-pdfs`).

Avoid:

- vague names: `helper`, `utils`, `tools`;
- overly generic names: `documents`, `data`, `files`;
- reserved words: `anthropic-helper`, `claude-tools`;
- mixing patterns inside one skill collection.

### Descriptions

The `description` is how Claude picks one skill out of potentially 100+.

- **Say what it does and when to use it,** with the key terms and triggers.
- **Write in third person.** The description is injected into the system
  prompt, and a mixed point of view can cause discovery problems.
  - Good: "Processes Excel files and generates reports."
  - Avoid: "I can help you process Excel files."
  - Avoid: "You can use this to process Excel files."

Good:

```yaml
description: Generate descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.
```

Too vague:

```yaml
description: Helps with documents
description: Processes data
description: Does stuff with files
```

### Progressive disclosure

`SKILL.md` is an overview that points to detail, like a table of contents.

- **Keep the `SKILL.md` body under 500 lines.**
- When it gets close, split content into separate files.
- Claude reads the extra files only when it needs them. Files that aren't
  read cost no context.

```text
pdf/
├── SKILL.md        main instructions (loaded when triggered)
├── FORMS.md        form-filling guide (loaded as needed)
├── reference.md    API reference (loaded as needed)
├── examples.md     usage examples (loaded as needed)
└── scripts/
    ├── analyze_form.py   run, not loaded
    └── validate.py
```

Three patterns:

1. **High-level guide with references:** a quick start in `SKILL.md`, with
   links to `FORMS.md`, `REFERENCE.md` and so on.
2. **Domain-specific organization:** one file per domain
   (`reference/finance.md`, `reference/sales.md`), so a sales question never
   loads finance.
3. **Conditional details:** basics inline, advanced material linked ("for
   tracked changes, see `REDLINING.md`").

Two rules for the files:

- **Keep references one level deep from `SKILL.md`.** If `SKILL.md` links to
  `advanced.md`, which links to `details.md`, Claude may only preview the
  deeper file (for example with `head -100`) and miss information.
- **Add a table of contents to reference files over 100 lines,** so Claude
  sees the full scope even in a partial read.

## Workflows and feedback loops

### Workflows for complex tasks

Break the task into clear, sequential steps. For bigger workflows, give a
checklist Claude can copy and tick off:

```text
Task Progress:
- [ ] Step 1: Analyze the form (run analyze_form.py)
- [ ] Step 2: Create field mapping (edit fields.json)
- [ ] Step 3: Validate mapping (run validate_fields.py)
- [ ] Step 4: Fill the form (run fill_form.py)
- [ ] Step 5: Verify output (run verify_output.py)
```

Clear steps stop Claude skipping critical validation. If a workflow gets
large, move it to its own file and tell Claude to read it when needed.

### Feedback loops

The pattern: **run a validator, fix the errors, repeat.** It greatly improves
output quality. The validator can be a script, or a reference document such
as a style guide that Claude checks its work against.

For batch, destructive or high-stakes work, use **plan, validate, execute**:
Claude writes its plan to a file (for example `changes.json`), a script
validates it, and only then are the changes applied. Make the validation
errors specific, e.g. "Field 'signature_date' not found. Available fields:
...", so Claude can fix them.

## Content guidelines

- **No time-sensitive information.** "Before August 2025 use the old API"
  becomes wrong. Put the current method first and legacy material in an "old
  patterns" section.
- **Use consistent terminology.** Pick one term and keep it (always "API
  endpoint", never a mix of "URL", "route" and "path").

## Common patterns

- **Template:** give an output template. Be strict ("ALWAYS use this exact
  structure") when the format matters, or flexible ("a sensible default,
  adapt as needed") when it doesn't.
- **Examples:** give input and output pairs. They show the style and level of
  detail better than a description does.
- **Conditional workflow:** guide Claude through decision points: creating new
  content goes one way, editing existing content goes another.

## Evaluation and iteration

### Build evaluations first

Write evaluations **before** extensive documentation, so the skill solves
real problems and not imagined ones.

1. **Identify gaps:** run Claude on representative tasks without the skill
   and note where it fails.
2. **Create evaluations:** three scenarios that test those gaps.
3. **Establish a baseline** without the skill.
4. **Write minimal instructions** that fix the gaps.
5. **Iterate:** run, compare with the baseline, refine.

### Develop with two Claude instances

- **Claude A** helps you design and refine the skill.
- **Claude B** (a fresh instance with the skill loaded) uses it on real
  tasks.

Observe what Claude B does, take the specifics back to Claude A ("it forgot
to filter by date for Q4"), update, and test again. Skills improve from
observed behaviour, not assumptions. You don't need a special "writing
skills" skill for this: ask Claude to create a skill and it produces a
properly structured `SKILL.md`.

### Watch how Claude navigates the skill

- **Unexpected reading order:** the structure may not be as intuitive as you
  thought.
- **Missed references:** make links more explicit.
- **Same file read repeatedly:** that content may belong in `SKILL.md`.
- **A file never read:** it is unnecessary or poorly signposted.

## Anti-patterns

- **Windows-style paths.** Always use forward slashes (`scripts/helper.py`),
  even on Windows.
- **Too many options.** Don't list five libraries. Give a default, with one
  escape hatch for the exception.
- **Assuming tools are installed.** State the dependency and how to install
  it.
- **Magic numbers.** Justify every constant in a script (why a 30 second
  timeout? why 3 retries?).

## Skills with scripts

- **Solve, don't defer.** Scripts should handle errors (a missing file, a
  permission error) and not just fail and leave it to Claude.
- **Prefer pre-made scripts to generated code.** They are more reliable, save
  tokens and time, and behave the same every time. Only the output enters
  the context.
- **Say whether to run or read.** "Run `analyze_form.py` to extract fields"
  versus "See `analyze_form.py` for the algorithm". Running is the usual
  choice.
- **Name files descriptively** (`form_validation_rules.md`, not `doc2.md`)
  and organise by domain (`reference/finance.md`, not `docs/file1.md`).
- **MCP tools need the full name,** `ServerName:tool_name` (for example
  `GitHub:create_issue`), or Claude may not find the tool.
- **Packages:** claude.ai can install from npm and PyPI; the Claude API has
  no network access and no runtime installs.

## Checklist before sharing a skill

**Core quality**

- [ ] Description is specific and includes key terms
- [ ] Description says what the skill does and when to use it
- [ ] `SKILL.md` body is under 500 lines
- [ ] Extra detail is in separate files
- [ ] No time-sensitive information
- [ ] Consistent terminology
- [ ] Examples are concrete, not abstract
- [ ] File references are one level deep
- [ ] Workflows have clear steps

**Code and scripts**

- [ ] Scripts solve problems and don't defer to Claude
- [ ] Error handling is explicit and helpful
- [ ] No magic numbers
- [ ] Required packages are listed
- [ ] Forward slashes in all paths
- [ ] Validation steps for critical operations

**Testing**

- [ ] At least three evaluations
- [ ] Tested with Haiku, Sonnet and Opus
- [ ] Tested with real usage scenarios
- [ ] Team feedback incorporated

## How our skills measure up (checked 2026-11-10)

| Skill | `SKILL.md` length | Notes |
|---|---|---|
| `investigate-ci-failure` | 93 lines | Well under 500. Scripts live in `scripts/`. Its description starts with a command ("Investigate why...") and not third person ("Investigates why..."). |
| `playwright-cli` | 493 lines | Just under the 500 limit. It already has a `references/` folder for the detail. |

## Takeaways

1. **Every token in `SKILL.md` has to earn its place.** Claude already knows
   a lot; only add what it doesn't.
2. **The description decides whether the skill fires.** Third person, what it
   does, when to use it.
3. **Keep `SKILL.md` under 500 lines** and push detail into files one level
   down.
4. **Fragile steps get exact scripts; open-ended steps get guidance.**
5. **Validate in a loop,** and for risky work plan, validate, then execute.
6. **Build evaluations first and test on real tasks.** Improve the skill from
   what Claude actually does with it.
