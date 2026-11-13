---
name: mapping-site-journeys
description: Use when a website or web app is being looked at for the first time and there is no journey map for it in apps/<app>/docs/, such as "investigate this site", "we've never looked at this app before", "explore the site so we can plan tests", or when the user asks to map or re-map how a site's pages connect.
---

# Mapping a site's journeys

## Overview

Before planning tests on a new site, draw how it fits together: which pages
exist, how you get from one to another, and where you leave for another app.
The map lets the user see the site at a glance and lets test planning start
from it. **Look at everything, change nothing.**

## When to use

- No `apps/<app>/docs/journey-map.md` exists for the site. No permission
  needed.
- The user asks to map or re-map it, or you notice the site changed (a route
  gone, a new menu item): say so first, then update the map.
- Not for test code structure (mapping-existing-framework).

## Read-only rules

- **The whole site, always.** Map every page you can reach, whatever the
  reason you were asked (even when another skill sent you for one area).
  "Outside the area I'm working on" is never a reason to leave a page out.
- **Click around freely** to reach pages: links, menus, tabs, sorting,
  filters, Cancel/Back, and buttons that only open a page (Checkout, Next,
  "Add" on a list that opens a form, Edit). The write is the button that
  saves or submits, not the one that opens the form.
- **Never complete a write action**: no Save, Add, Submit, Create, Delete,
  Remove, Upload, Import, Reset, Sync, Send, Finish/Place order, Add to cart,
  or anything else that adds, changes or removes data. When in doubt, don't.
- Reach a page by link or URL instead of by writing. A page you can only reach
  through a write action goes in the map as "not reached (needs a write
  action)".
- No failed-login attempts (account lockout). Log in only with the
  credentials the user named, from where they keep them; never write them
  down.
- Leaving for an external site or another app: note it as a new node, don't
  explore past its front door unless it's the same product.

## Process

1. **Name the app** (`<app>`, kebab-case): the name the repo already uses
   (`apps/`, the framework map) if any; otherwise the product's
   own name as the site or the user calls it (page title "Swag Labs" →
   `swag-labs`), not the domain. Check `apps/<app>/docs/` frontmatter for an
   existing map.
2. Explore with playwright-cli (REQUIRED), page by page: route, title or
   heading, one-line purpose, page type (list, form, search, detail, tool,
   dashboard), the controls that lead elsewhere, counts (records, tabs).
3. Write `apps/<app>/docs/journey-map.md` and `observations.md` from
   `map-template.md`, both with the five frontmatter fields.
4. Add a pointer to both files under `## Docs` in the app's memory,
   `apps/<app>/memory.md` in the agent's memory folder (create the file and
   its line in `MEMORY.md` if missing).
5. Close the browser.

## Common mistakes

- Lists of pages and locators with no diagram: that's notes, not a map.
- Pressing Finish, Save or Add to cart "just to see the next page".
- Copying the login password into the map because it's shown on the page.
- Exploring deep into an external site.
