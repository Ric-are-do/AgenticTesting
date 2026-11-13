---
app: qa-practice
description: qa-practice (https://qaengineerwaqas.com/qa-practice) safety rules and approvals
updated: 2026-11-13
---

# qa-practice memory

## Rules and approvals
- **Never submit the home page contact form.** It posts to a real form
  service. The practice forms on `/qa-practice` were checked on 2026-11-13:
  submitting them fired only an analytics call (`POST /__l5e/trackevents`),
  no form post. Re-check the network calls if the page changes.
- No credential defaults approved (the site has no real login).

## Quirks and possible bugs
- None kept. The app was removed on 2026-11-13 so the skills can be re-run
  on it from scratch.

## Docs
- None (the app folder `apps/qa-practice/` was removed).
