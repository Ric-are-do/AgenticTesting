# Frontmatter in Markdown

What frontmatter is, which formats exist, and which one we use.

Sources:

- [Using Frontmatter in Markdown](https://www.markdownlang.com/advanced/frontmatter.html)
  (markdownlang.com)
- [Front Matter CMS: Markdown docs](https://frontmatter.codes/docs/markdown/)
  (frontmatter.codes), an additional frontmatter resource
- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
  (Claude docs), for the `SKILL.md` frontmatter rules
- [Video: frontmatter and AI workflows](https://www.youtube.com/watch?v=Fj7RuAHm_AU)
  (YouTube), an additional resource

## What is frontmatter?

Frontmatter is a block of metadata at the start of a Markdown file, enclosed
by delimiters. It gives information about the document that isn't part of the
main content, such as its title, date, author or tags.

It is widely used in static site generators and content management systems.

## Why we use frontmatter with AI workflows and skills

### 1. Progressive disclosure and token efficiency

AI agents do not load every instruction file into memory at once. At startup
or when scanning, the system reads only the lightweight YAML frontmatter (the
`name` and `description`). The full Markdown body and any heavy reference
files stay hidden until the agent decides the skill is relevant.

This protects the context window and avoids context rot (the "dumb zone"),
where a context full of unneeded instructions makes the model perform worse.

### 2. Semantic routing and trigger conditions

The `description` field works as the trigger condition. The LLM compares the
user's prompt against each description to decide whether, and when, to invoke
a skill, workflow or protocol.

So a vague description means the skill doesn't fire, or fires at the wrong
time. In our skills the description says **when** to use the skill, not what
it does (see "Our rule" below).

### 3. Knowledge organization and filtering

In large knowledge bases or agent directories (Obsidian, Notion, a custom
codebase), frontmatter lets an agent filter and find exact resources
programmatically, for example by tags, dates or complexity level, without
parsing messy prose.

## Different types of frontmatter

Frontmatter can be written in more than one format:

| Format | Delimiters | Notes |
|---|---|---|
| **YAML** | `---` at the start and end | The most common format. |
| **TOML** | `+++` at the start and end | Used by some tools, for example Hugo. |
| **JSON** | A JSON object in `{ }` | Less common. |

**We use YAML frontmatter.** It is the most common format, and it is the one
the tools we work with expect. Its delimiter is three dashes (`---`) on their
own line, one before the metadata and one after it.

## Example

```markdown
---
title: My Article Title
date: 2024-01-15
author: John Doe
tags: [markdown, tutorial, web]
---

# Article Content Starts Here

Your regular Markdown content follows...
```

How it reads:

- The first `---` must be on the **very first line** of the file.
- Between the two `---` lines are `key: value` pairs. Values can be text,
  dates, or lists such as `[markdown, tutorial, web]`.
- The second `---` ends the metadata.
- Everything after it is the normal Markdown content.

## Best practices

From the same article:

- **Be consistent:** use the same frontmatter structure across documents.
- **Required fields:** always include essential fields like `title` and
  `date`.
- **Use standards:** follow ISO formats for dates (for example `2024-01-15`).
- **Document the schema:** maintain documentation of your frontmatter schema.
- **Validate:** use schema validation to catch errors.
- **Default values:** provide sensible defaults when fields are optional.

## Frontmatter in skills (`SKILL.md`)

Our skills in `.claude/skills/` (for example `investigate-ci-failure`) start
with YAML frontmatter. The Claude docs say the `SKILL.md` frontmatter requires
two fields ([source](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)).
For the full skill guidance, see
[10-claude-skills-best-practices.md](10-claude-skills-best-practices.md).

**`name`**

- Maximum 64 characters.
- Only lowercase letters, numbers and hyphens.
- Cannot contain XML tags.
- Cannot contain the reserved words `anthropic` and `claude`.

**`description`**

- Must be non-empty.
- Maximum 1,024 characters.
- Cannot contain XML tags.
- The Claude docs say it should describe what the skill does and when to use
  it.

**Our rule for `description`** (from the superpowers `writing-skills` skill,
which we follow for all our skills):

- Start with **"Use when..."** and describe only the **triggering
  conditions**: the situations, symptoms and keywords that mean the skill
  applies.
- **Never summarise the skill's steps.** Agents that see the steps in the
  description tend to follow the description and skip the skill body.
- Write in the third person (never "I can..." or "You can..."), and stay
  under about 500 characters.
- Say when **not** to use it if another skill is easy to confuse with it.

This is where we differ from the Claude docs: our descriptions leave out
"what it does" on purpose. Routing was tested with this form: 35/35 with all
5 skills (see `docs/superpowers/skill-tests/skill-descriptions.md` and
`healing-playwright-tests.md` in the same folder).

```markdown
---
name: investigate-ci-failure
description: Use when Playwright tests failed in GitHub Actions or CI, such as "why did CI fail" or a failed run ID. Not for tests that fail when run locally.
---

# Skill body starts here
```

## Takeaways

1. **Frontmatter is metadata, not content.** It describes the document; the
   text below the second `---` is the document.
2. **We use YAML with `---` delimiters.** Don't mix in TOML (`+++`) or JSON
   frontmatter.
3. **The opening `---` has to be the first line.** Anything above it, even a
   blank line, can stop the block from being recognised.
4. **In a skill, the `description` is the trigger.** Start with "Use when...",
   name the triggering conditions only, never the steps, and stay well within
   1,024 characters (aim for under 500).
5. **Frontmatter is what the agent reads first.** Keep it short so the
   context window isn't spent on skills that aren't needed.
