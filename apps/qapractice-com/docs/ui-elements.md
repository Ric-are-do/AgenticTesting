---
app: qapractice-com
area: ui-elements
title: UI elements page behaviour
description: Controls, their Output-box texts and locator quirks on qapractice.com's UI elements page
updated: 2026-11-13
---

# UI elements (`/practice-different-ui-elements`)

- Each control sits in a `div.row.mb-3` with an `.output-box` (no test id);
  the page object finds the box through the control's test id.
- Outputs seen: text field / textarea mirror the text; "Clicked N times";
  "Checked" / "Unchecked"; "Checked: option1, option3"; "Radio 3"; "India";
  "Option A, Option C"; "Link Clicked!" (no navigation); "Image Clicked!";
  "Table sorted by name"; "Slider Value: N" (0-100, starts 50); "Progress:
  N%" (starts 30, +10 per click, stops at 100, button stays enabled); "Modal
  is open" then back to 'Click "Show Modal"' after Close; the typed date;
  'File "sample.txt" selected'; "Notification shown"; "Active Tab: tab2".
- Radio test ids contain a space: `ui-radio-Radio 1`.
- Table (ID / Name / Age) starts 1 Zui, 3 Bob, 2 Charlie, 5 Ashley, 4 Nat,
  6 Jim; clicking `ui-th-name` sorts by name. Row text has no spaces between
  cells ("1Zui30").
- The modal has two "Close" buttons (X and footer). The toast text
  "Operation completed successfully." also appears in the page's test-case
  table: match it exactly.
- Not covered yet: drag and drop, iframe, accordion, virtual scrolling,
  "Simulate Download" (alert).
