# QA Practice Web Forms Test Plan

## Application Overview

https://www.qapractice.com/practice-forms: country, title, first and last
name, date of birth (YYYY-MM-DD), date of joining (dd/mm/yyyy), email, phone
code and number, communication preference (Email / Phone radios), Clear and
Submit. Browser-only (nothing sent). Valid values: `validFormDetails` in
`apps/qapractice-com/data/web-forms.ts`. Fresh browser state assumed. Seen
live 2026-11-13.

## Test Scenarios

### 1. Web forms

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 1.1. Fully valid form is accepted

**File:** `apps/qapractice-com/tests/ui/web-forms-valid.spec.ts`

**Steps:**
  1. Fill every field from validFormDetails, click [data-testid=forms-submit].
    - expect: [data-testid=forms-success] reads "Details Successfully Added!"

#### 1.2. Empty form lists every required field

**File:** `apps/qapractice-com/tests/ui/web-forms-empty.spec.ts`

**Steps:**
  1. Click Submit with everything empty.
    - expect: nine messages, in order: "Country of Residence is required", "Title is required", "First Name is required", "Last Name is required", "Date of Birth is required", "Date of Joining is required (dd/mm/yyyy)", "Email Address is required", "Phone Number is required", "Please select a Communication Preference"

#### 1.3. Wrong date-of-joining format is reported

**File:** `apps/qapractice-com/tests/ui/web-forms-doj-format.spec.ts`

**Steps:**
  1. Fill valid values but date of joining 2021-06-01, click Submit.
    - expect: "Date of Joining format should be dd/mm/yyyy"; no success message

#### 1.4. Missing communication preference is reported

**File:** `apps/qapractice-com/tests/ui/web-forms-no-communication.spec.ts`

**Steps:**
  1. Fill valid values but select no radio, click Submit.
    - expect: "Please select a Communication Preference"; no success message

#### 1.5. Email without @ is blocked by the browser

**File:** `apps/qapractice-com/tests/ui/web-forms-email-blocked.spec.ts`

**Steps:**
  1. Fill valid values but email "notanemail", click Submit.
    - expect: the email field is invalid; no success message and no "Invalid Email Address" text (the site's own checklist expects that message, but the browser's type=email check stops the submit first)

#### 1.6. Country dropdown offers six countries

**File:** `apps/qapractice-com/tests/ui/web-forms-country-options.spec.ts`

**Steps:**
  1. Open the page and read [data-testid=forms-country]'s options.
    - expect: "Select Country", "United States", "Canada", "United Kingdom", "India", "Australia", "Other"

#### 1.7. Clear resets the form

**File:** `apps/qapractice-com/tests/ui/web-forms-clear.spec.ts`

**Steps:**
  1. Select India, fill first name Jane and email a@b.com, choose Phone, click [data-testid=forms-clear].
    - expect: country, first name and email are empty; Phone is not checked

#### 1.8. Communication radios are exclusive

**File:** `apps/qapractice-com/tests/ui/web-forms-radios-exclusive.spec.ts`

**Steps:**
  1. Check Email, then Phone.
    - expect: Phone is checked, Email is not

#### 1.9. Letters in the phone number are rejected (known bug)

**File:** `apps/qapractice-com/tests/ui/web-forms-phone-letters-bug.spec.ts`

**Steps:**
  1. Fill valid values but phone "abcdef", click Submit.
    - expect: no success message. **Live (2026-11-13): "Details Successfully Added!" is shown.** Marked `test.fail()` until fixed.
