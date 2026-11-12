# App knowledge base (`docs/apps/<app>/`)

What we know about each app, for people and agents: overview, journey map,
business rules (the user's explanations), environments and where test accounts
live (never the secrets), known bugs and quirks.

## Every file starts with frontmatter

```yaml
---
app: swag-labs
area: checkout
title: Checkout flow
description: Steps, validation messages and the empty-cart quirk in checkout
updated: 2026-11-12
---
```

All five fields, every time. `updated` is the date of the change. One topic per
file. A file without all five fields is not finished.

## Reading

Don't open every file. Search the frontmatter first, for example `Grep` for
`^description:` or `^area:` in `docs/apps/<app>/`, then open only the files
that match what you need.

## Writing

- New knowledge goes in a new file or the file whose `area` matches.
- Exploration output (journey maps, observations) goes here, not to
  `reports/`.
- Agent memory gets at most a one-line pointer, never a copy.
