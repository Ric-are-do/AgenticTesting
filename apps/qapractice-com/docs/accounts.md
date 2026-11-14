---
app: qapractice-com
area: accounts
title: Login, register and forgot-password behaviour
description: Exact messages, validation order and test ids of qapractice.com's login, register and 3-step forgot-password pages
updated: 2026-11-13
---

# Accounts (login, register, forgot password)

All three pages run in the browser only. Demo values are printed on the pages
and live in `demoAccount` (app.config.ts); never copy them into docs.

## Login (`/practice-login-form`)
- Test ids: `login-email`, `login-password` (type=password), `login-remember`
  (unchecked by default), `login-submit`, `login-error`, `login-success`,
  `login-forgot-password`, `login-register`.
- Messages: both empty → "Email and Password are required"; no password →
  "Password is required"; no email → "Email is required"; wrong pair →
  "Invalid email id and password"; demo pair → "Login Successful! Welcome to
  Premium Banking.".
- An email without "@" never reaches the app: the browser's type=email check
  blocks the submit (no message on the page).

## Register (`/register`)
- Test ids: `register-email`, `register-password`,
  `register-confirm-password`, `register-submit`, `register-error`,
  `register-success`.
- Checks in this order: email required → password rules ("Password does not
  meet the requirements") → "Please confirm your password" → "Passwords do
  not match" → "Registration Successful".
- "Password must include:" checklist: five `.list-group-item` rows, class
  `text-danger` until met, then `text-success`, updated as you type.

## Forgot password (`/forget-password`)
- Step 1: `forgot-email`, `forgot-email-submit` ("Continue"). Empty → "Email
  is required"; unknown → "Email not found in our records".
- Step 2: `forgot-code`, `forgot-code-submit` ("Verify Code"). Empty →
  "Secret code is required"; wrong → "Invalid secret code".
- Step 3: `forgot-current-password`, `forgot-new-password`,
  `forgot-confirm-password`, `forgot-submit`. Any empty → "All fields are
  required"; mismatch → "Passwords do not match"; weak → "Password does not
  meet requirements"; else → `forgot-success` "Password Changed
  Successfully!".
- One error element, `forgot-error`, for every step.
- **Bug:** the current password is never checked (any value succeeds), and
  the new password may equal the old one.
