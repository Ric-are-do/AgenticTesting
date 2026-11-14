---
app: qapractice-com
area: web-forms
title: Web forms page behaviour
description: Fields, options, required messages and validation gaps of qapractice.com's /practice-forms page
updated: 2026-11-13
---

# Web forms (`/practice-forms`)

- Test ids: `forms-country`, `forms-title`, `forms-first-name`,
  `forms-last-name`, `forms-dob` (YYYY-MM-DD), `forms-doj` (dd/mm/yyyy),
  `forms-email` (type=email), `forms-phone-code`, `forms-phone-number`,
  `forms-comm-email`, `forms-comm-phone`, `forms-clear`, `forms-submit`,
  `forms-success` ("Details Successfully Added!").
- Options: country Select Country / United States / Canada / United Kingdom /
  India / Australia / Other; title Mr. / Ms. / Mrs. / Dr. / Prof.; phone code
  +1 / +44 / +91 / +61 / +86 / +Other.
- Empty submit shows nine `.text-danger.form-text` messages (see the plan for
  the exact list).
- Date of joining in the wrong format → "Date of Joining format should be
  dd/mm/yyyy". Date of birth in the wrong format (15/05/1990) → "Date of Birth
  is required" (misleading message).
- An email without "@" is blocked by the browser, so the site's own published
  case "Invalid Email Address" is never shown. "jane@example" passes.
- Not validated: letters or 2 digits in the phone number, digits in the
  first name. All are accepted (phone letters covered by a known-bug test).
- Clear empties every field and both radios; the radios are exclusive.
