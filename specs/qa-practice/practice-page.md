# QA Practice Practice Page Test Plan

## Application Overview

The QA Practice page at `https://qaengineerwaqas.com/qa-practice` (a React
single-page app, no login). One page holds every exercise: practice forms
(login, signup, contact, form elements), a functional area (search, category
filters, paging over a 10-row table), automation practice (counter, show/hide
toggle, a 5-row tools table) and deliberate UI bugs. Form results are shown as
browser `alert()` dialogs or inline red messages; nothing is sent to a server
(only the site's analytics event). Containers and outputs carry `data-testid` (`login-form`, `login-error`,
`row-1`, `pagination`, `counter-value`, `toggle-content`, `tool-row-*`);
inputs and buttons carry only an `id` (`#login-email`, `#login-submit`). Fresh browser state assumed. The home page contact form is
**out of scope**: it posts to a real form service.

## Test Scenarios

### 1. Login form

**Seed:** `tests/qa-practice/seed.spec.ts`

#### 1.1. Login with a strong password succeeds

**File:** `tests/qa-practice/ui/login-strong-password-succeeds.spec.ts`

**Steps:**
  1. Open the practice page, fill `#login-email` with `qa.test@example.com` and `#login-password` with `Test12345!`, click `#login-submit`.
    - expect: an alert dialog with the message `Login successful!`

#### 1.2. Login with empty fields asks to fill them

**File:** `tests/qa-practice/ui/login-empty-fields.spec.ts`

**Steps:**
  1. Open the practice page, click `#login-submit` without typing.
    - expect: the text `Please fill all fields` in the login form
    - expect: no dialog

#### 1.3. Login with only an email asks to fill all fields

**File:** `tests/qa-practice/ui/login-email-only.spec.ts`

**Steps:**
  1. Fill only `#login-email` with `qa.test@example.com`, click `#login-submit`.
    - expect: the text `Please fill all fields` in the login form

#### 1.4. Weak password is accepted (known bug)

**File:** `tests/qa-practice/ui/login-weak-password-bug.spec.ts`

**Steps:**
  1. Fill `#login-email` with `not-an-email` and `#login-password` with `x`, click `#login-submit`.
    - expect: an alert dialog with the message `Login successful (bug: weak password accepted)`

### 2. Signup form

**Seed:** `tests/qa-practice/seed.spec.ts`

#### 2.1. Valid signup succeeds

**File:** `tests/qa-practice/ui/signup-valid.spec.ts`

**Steps:**
  1. Fill `#signup-name` `QA Test`, `#signup-email` `qa.test@example.com`, `#signup-password` and `#signup-confirm` `Test12345!`, click `#signup-submit`.
    - expect: an alert dialog with the message `Signup Successfully`

#### 2.2. Empty signup asks for a name

**File:** `tests/qa-practice/ui/signup-name-required.spec.ts`

**Steps:**
  1. Click `#signup-submit` without typing.
    - expect: the text `Name required` in the signup form; no dialog

#### 2.3. Signup without an email asks for a valid email

**File:** `tests/qa-practice/ui/signup-email-required.spec.ts`

**Steps:**
  1. Fill only `#signup-name` `QA Test`, click `#signup-submit`.
    - expect: the text `Enter Valid Email Address` in the signup form; no dialog

#### 2.4. Mismatched passwords are rejected

**File:** `tests/qa-practice/ui/signup-password-mismatch.spec.ts`

**Steps:**
  1. Fill name, email `qa.test@example.com`, `#signup-password` `Test12345!`, `#signup-confirm` `Different1!`, click `#signup-submit`.
    - expect: the text `Passwords don't match` in the signup form; no dialog

#### 2.5. A one-character password is accepted (known bug)

**File:** `tests/qa-practice/ui/signup-short-password-bug.spec.ts`

**Steps:**
  1. Fill name, email `qa.test@example.com`, password and confirm `1`, click `#signup-submit`.
    - expect: an alert dialog with the message `Signup Successfully`

### 3. Contact form ("Missing Validations")

**Seed:** `tests/qa-practice/seed.spec.ts`

#### 3.1. Empty contact form is submitted (known bug)

**File:** `tests/qa-practice/ui/contact-empty-submits-bug.spec.ts`

**Steps:**
  1. Click `#contact-submit` without typing.
    - expect: an alert dialog with the message `Submitted! (Bug: no validation)`

### 4. Form elements

**Seed:** `tests/qa-practice/seed.spec.ts`

#### 4.1. Country select lists four countries and keeps the choice

**File:** `tests/qa-practice/ui/form-elements-country.spec.ts`

**Steps:**
  1. Click `#select-country` (a combobox).
    - expect: options `United States`, `United Kingdom`, `Pakistan`, `India`, in that order
  2. Choose `Pakistan`.
    - expect: `#select-country` shows `Pakistan`

#### 4.2. Checkboxes toggle

**File:** `tests/qa-practice/ui/form-elements-checkboxes.spec.ts`

**Steps:**
  1. Click `#terms-checkbox` and `#newsletter-checkbox`.
    - expect: both are checked (`aria-checked="true"`)
  2. Click `#terms-checkbox` again.
    - expect: it is unchecked; the newsletter box stays checked

### 5. Functional testing area

**Seed:** `tests/qa-practice/seed.spec.ts`

#### 5.1. The table starts on page 1 of 3 with four rows

**File:** `tests/qa-practice/ui/functional-first-page.spec.ts`

**Steps:**
  1. Open the practice page and look at `#data-table`.
    - expect: rows `1 Playwright Tutorial automation`, `2 Manual Testing Basics manual`, `3 Selenium Guide automation`, `4 Bug Report Writing manual`
    - expect: the text `Page 1 of 3`; `#prev-page` disabled, `#next-page` enabled

#### 5.2. Paging moves through the rows

**File:** `tests/qa-practice/ui/functional-paging.spec.ts`

**Steps:**
  1. Click `#next-page`.
    - expect: `Page 2 of 3`; rows with IDs 5, 6, 7, 8 (`GitHub Copilot for QA`, `API Testing Intro`, `Test Case Design`, `AI Test Generation`)
  2. Click `#next-page` again.
    - expect: `Page 3 of 3`; `#next-page` disabled

#### 5.3. Search narrows the rows

**File:** `tests/qa-practice/ui/functional-search.spec.ts`

**Steps:**
  1. Type `sel` into `#search-input`.
    - expect: one row, `3 Selenium Guide automation`; `Page 1 of 1`

#### 5.4. Search with no match shows an empty state

**File:** `tests/qa-practice/ui/functional-search-no-results.spec.ts`

**Steps:**
  1. Type `zzzz` into `#search-input`.
    - expect: the text `No results found`; `Page 1 of 1`

#### 5.5. Category filter shows only that category

**File:** `tests/qa-practice/ui/functional-filter-ai.spec.ts`

**Steps:**
  1. Click `#filter-ai`.
    - expect: two rows, `5 GitHub Copilot for QA ai` and `8 AI Test Generation ai`; `Page 1 of 1`
  2. Click `#filter-all`.
    - expect: back to `Page 1 of 3`

### 6. Automation practice

**Seed:** `tests/qa-practice/seed.spec.ts`

#### 6.1. Counter increments, decrements and resets

**File:** `tests/qa-practice/ui/automation-counter.spec.ts`

**Steps:**
  1. Check `#counter-value`.
    - expect: `0`
  2. Click `#counter-increment` twice, then `#counter-decrement` once.
    - expect: `#counter-value` is `1`
  3. Click `#counter-reset`.
    - expect: `#counter-value` is `0`

#### 6.2. Counter goes below zero

**File:** `tests/qa-practice/ui/automation-counter-negative.spec.ts`

**Steps:**
  1. Click `#counter-decrement` twice.
    - expect: `#counter-value` is `-2` (no lower bound)

#### 6.3. Toggle hides and shows the element

**File:** `tests/qa-practice/ui/automation-toggle.spec.ts`

**Steps:**
  1. Check `#toggle-button`.
    - expect: its text is `Hide Element`; the text `This element can be toggled — great for testing visibility assertions!` is visible
  2. Click `#toggle-button`.
    - expect: the text is hidden; the button reads `Show Element`
  3. Click it again.
    - expect: the text is visible again; the button reads `Hide Element`

#### 6.4. Tools table lists five tools

**File:** `tests/qa-practice/ui/automation-tools-table.spec.ts`

**Steps:**
  1. Read `#automation-table`.
    - expect: columns `Tool`, `Type`, `Level`; rows `Playwright E2E Advanced`, `Selenium E2E Intermediate`, `Cypress E2E Intermediate`, `JUnit Unit Beginner`, `Postman API Beginner`

### 7. UI/UX issues

**Seed:** `tests/qa-practice/seed.spec.ts`

#### 7.1. The broken button is disabled (known bug)

**File:** `tests/qa-practice/ui/ui-broken-button.spec.ts`

**Steps:**
  1. Find `#broken-button`.
    - expect: text `Click Me (Disabled Bug)`; it is disabled
