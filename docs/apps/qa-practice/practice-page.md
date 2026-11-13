---
app: qa-practice
area: practice-page
title: QA Practice page behaviour
description: Exact messages, dialogs and data of every exercise on /qa-practice, seen live
updated: 2026-11-13
---

# QA Practice page: how each exercise behaves

Seen live on 2026-11-13 at `https://qaengineerwaqas.com/qa-practice`.

- **No server writes.** Practice forms have no `action`; submitting only fires
  the site's analytics event (`POST /__l5e/trackevents`). Safe to test.
  The **home page** contact form is different: it posts to a third-party form
  service. Don't test it.
- **Locators:** containers and outputs have `data-testid` (login-form,
  signup-form, contact-form, elements-form, login-error, signup-error,
  filter-buttons, items-table, row-1..row-4, pagination, counter-value,
  toggle-content, automation-table, tool-row-<tool>, *-section); inputs and
  buttons have only an `id`. (The journey map says "no data-testid": wrong.)
- **Results come as `alert()` dialogs** (handle with `page.once('dialog')`)
  or as red inline text inside the form.

| Exercise | Input | Result |
|---|---|---|
| Login | empty, or only one field | inline `Please fill all fields` |
| Login | `qa.test@example.com` / `Test12345!` | alert `Login successful!` |
| Login | `not-an-email` / `x` | alert `Login successful (bug: weak password accepted)` |
| Signup | empty | inline `Name required` |
| Signup | name only | inline `Enter Valid Email Address` |
| Signup | email `nope`, passwords match | **nothing at all** (no message, no alert) |
| Signup | passwords differ | inline `Passwords don't match` |
| Signup | valid, or password `1` | alert `Signup Successfully` (no length rule) |
| Contact | anything, even empty | alert `Submitted! (Bug: no validation)` |
| Form elements | any state | Submit gives no visible feedback |

- **Country select** (`#select-country`, Radix combobox): United States,
  United Kingdom, Pakistan, India. Checkboxes `#terms-checkbox`,
  `#newsletter-checkbox` are Radix `role=checkbox` (use `aria-checked`).
- **Functional area** (`#data-table`): 10 items, 4 per page, `Page N of 3`,
  `#prev-page` disabled on page 1, `#next-page` disabled on page 3. Search is
  a case-insensitive substring match; no match shows `No results found` and
  `Page 1 of 1`. Filters: Manual 4, Automation 4, Ai 2 (IDs 5 and 8).
- **Counter** `#counter-value` starts at 0, no lower bound.
- **Toggle** `#toggle-button` reads `Hide Element` / `Show Element`; the
  toggled text is `This element can be toggled — great for testing visibility
  assertions!`.
- **Tools table** `#automation-table`: Playwright E2E Advanced, Selenium E2E
  Intermediate, Cypress E2E Intermediate, JUnit Unit Beginner, Postman API
  Beginner.
- **Broken button** `#broken-button` `Click Me (Disabled Bug)` is disabled.
