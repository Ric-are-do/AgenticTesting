---
app: qa-practice
area: observations
title: QA Practice observations
description: Possible bugs, quirks and inconsistencies seen while mapping qa-practice
updated: 2026-11-13
---

## Possible bugs or risks
1. The counter (`#counter-decrement`) goes below zero: 2 increments then 4 decrements showed -2. May be intentional, but there is no lower bound.
2. The page title lags the route: right after navigation the title read was the previous page's (the SPA updates `document.title` late). Title assertions need a wait.
3. `/blog` returns the 404 page although three `/blog/...` posts exist; there is no blog index. `/portfolio` is linked only from the WP audit page, not from the header or footer.
4. The Home contact form has a hidden `access_key` input (third-party form service key in the markup). Not tested (write action).
5. Many non-form controls (filters, pagination, counter, Button 1/2/3) have `type=submit` though they are not inside a form.
6. Intentional bugs the page announces (not checked deeply): Contact Form "Missing Validations"; "Click Me (Disabled Bug)" is disabled; misaligned buttons; overlapping text; fixed 500px box on mobile.

## Quirks that matter for tests
- Locators: containers and outputs have `data-testid` (login-form, login-error, items-table, row-1, pagination, counter-value, toggle-content, tool-row-<tool>); inputs and buttons have only an `id` (`#login-email`, `#filter-manual`, `#next-page`, `#counter-increment`, `#toggle-button`, `#search-input`). Corrected 2026-11-13 while planning; the first mapping run missed the test ids.
- Checkboxes and the country select are Radix UI widgets: `button[role=checkbox]` (state in `aria-checked` / `data-state`) and `button[role=combobox]` with `[role=option]` items in a portal. Not native checkbox or select.
- Filter buttons change the pager: filtered shows "Page 1 of 1", All shows "Page 1 of 3". Next is disabled on page 3, Prev on page 1. Page size is 4.
- Toggle button text switches "Hide Element" / "Show Element" and the element is removed from the DOM.
- Two plain `<table>` elements on the page (functional list first, tools table second).
- External links open in a new tab.
- Ad and affiliate blocks shift content; avoid position-based locators.
- During mapping the browser process died once (tool issue, not the site).

## Not checked
- Form submit results and validation messages, Home "Send message" (write actions).
- Counter Reset and Button 1/2/3 (not pressed).
- Mobile layout and hamburger menu (desktop only).
- External sites, console errors, network calls.
