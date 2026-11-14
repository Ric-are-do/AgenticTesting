# QA Practice Accounts Test Plan

## Application Overview

https://www.qapractice.com: the login (`/practice-login-form`), register
(`/register`) and forgot-password (`/forget-password`) practice pages. All
three run only in the browser (nothing is sent or saved), so submitting is
safe. Demo values come from `demoAccount` in `app.config.ts` (env
`QAPRACTICE_COM_EMAIL`, `QAPRACTICE_COM_PASSWORD`, `QAPRACTICE_COM_SECRET_CODE`).
Fresh browser state assumed. Seen live 2026-11-13.

## Test Scenarios

### 1. Login

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 1.1. Valid demo credentials sign in

**File:** `apps/qapractice-com/tests/ui/login-valid.spec.ts`

**Steps:**
  1. Open /practice-login-form, fill [data-testid=login-email] and [data-testid=login-password] with the demo email and password, click [data-testid=login-submit].
    - expect: [data-testid=login-success] reads "Login Successful! Welcome to Premium Banking."

#### 1.2. Empty form shows both fields required

**File:** `apps/qapractice-com/tests/ui/login-empty-fields.spec.ts`

**Steps:**
  1. Open /practice-login-form and click Sign in with both fields empty.
    - expect: [data-testid=login-error] reads "Email and Password are required"

#### 1.3. Missing password is reported

**File:** `apps/qapractice-com/tests/ui/login-missing-password.spec.ts`

**Steps:**
  1. Fill only the demo email and click Sign in.
    - expect: [data-testid=login-error] reads "Password is required"

#### 1.4. Missing email is reported

**File:** `apps/qapractice-com/tests/ui/login-missing-email.spec.ts`

**Steps:**
  1. Fill only the demo password and click Sign in.
    - expect: [data-testid=login-error] reads "Email is required"

#### 1.5. Wrong credentials are rejected

**File:** `apps/qapractice-com/tests/ui/login-wrong-credentials.spec.ts`

**Steps:**
  1. Fill wrong@example.com and nope1234, click Sign in.
    - expect: [data-testid=login-error] reads "Invalid email id and password"; [data-testid=login-success] is not shown

#### 1.6. Email without @ is blocked by the browser

**File:** `apps/qapractice-com/tests/ui/login-email-format-blocked.spec.ts`

**Steps:**
  1. Fill notanemail and the demo password, click Sign in.
    - expect: the email field is invalid (type=email check); neither [data-testid=login-error] nor [data-testid=login-success] appears

#### 1.7. Password is masked

**File:** `apps/qapractice-com/tests/ui/login-password-masked.spec.ts`

**Steps:**
  1. Open the login page.
    - expect: [data-testid=login-password] has type="password"

#### 1.8. Forgot password link opens the recovery page

**File:** `apps/qapractice-com/tests/ui/login-forgot-password-link.spec.ts`

**Steps:**
  1. Click [data-testid=login-forgot-password] ("Forgot password?").
    - expect: URL is /forget-password and [data-testid=forgot-email-submit] is shown

#### 1.9. Register link opens the register page

**File:** `apps/qapractice-com/tests/ui/login-register-link.spec.ts`

**Steps:**
  1. Click [data-testid=login-register] ("Register now").
    - expect: URL is /register and [data-testid=register-submit] is shown

### 2. Register

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 2.1. Valid registration succeeds

**File:** `apps/qapractice-com/tests/ui/register-valid.spec.ts`

**Steps:**
  1. Open /register, fill new.user@example.com, Secret@123, Secret@123, click [data-testid=register-submit].
    - expect: [data-testid=register-success] reads "Registration Successful"

#### 2.2. Empty form asks for the email

**File:** `apps/qapractice-com/tests/ui/register-empty.spec.ts`

**Steps:**
  1. Click Register with every field empty.
    - expect: [data-testid=register-error] reads "Email is required"

#### 2.3. Mismatched passwords are rejected

**File:** `apps/qapractice-com/tests/ui/register-password-mismatch.spec.ts`

**Steps:**
  1. Fill new.user@example.com, Secret@123, Other@123, click Register.
    - expect: [data-testid=register-error] reads "Passwords do not match"

#### 2.4. Weak password is rejected

**File:** `apps/qapractice-com/tests/ui/register-weak-password.spec.ts`

**Steps:**
  1. Fill new.user@example.com, password "1", confirm "1", click Register.
    - expect: [data-testid=register-error] reads "Password does not meet the requirements"

#### 2.5. Missing confirmation is reported

**File:** `apps/qapractice-com/tests/ui/register-missing-confirm.spec.ts`

**Steps:**
  1. Fill new.user@example.com and Secret@123, leave confirm empty, click Register.
    - expect: [data-testid=register-error] reads "Please confirm your password"

#### 2.6. Password checklist follows what is typed

**File:** `apps/qapractice-com/tests/ui/register-password-checklist.spec.ts`

**Steps:**
  1. Open /register.
    - expect: all five "Password must include:" rules have class text-danger
  2. Type "abc" into [data-testid=register-password].
    - expect: only "At least one lowercase letter (a-z)" has class text-success
  3. Type "Secret@123".
    - expect: all five rules have class text-success

### 3. Forgot password

**Seed:** `apps/qapractice-com/tests/seed.spec.ts`

#### 3.1. Full password reset succeeds

**File:** `apps/qapractice-com/tests/ui/forgot-password-reset.spec.ts`

**Steps:**
  1. Open /forget-password, fill the demo email in [data-testid=forgot-email], click [data-testid=forgot-email-submit].
    - expect: [data-testid=forgot-code] is shown
  2. Fill the demo secret code, click [data-testid=forgot-code-submit].
    - expect: [data-testid=forgot-submit] ("Reset Password") is shown
  3. Fill current = demo password, new and confirm = New@12345, click Reset Password.
    - expect: [data-testid=forgot-success] reads "Password Changed Successfully!"

#### 3.2. Empty email is reported

**File:** `apps/qapractice-com/tests/ui/forgot-password-empty-email.spec.ts`

**Steps:**
  1. Click Continue with the email empty.
    - expect: [data-testid=forgot-error] reads "Email is required"

#### 3.3. Unknown email is rejected

**File:** `apps/qapractice-com/tests/ui/forgot-password-unknown-email.spec.ts`

**Steps:**
  1. Fill someone@example.com, click Continue.
    - expect: [data-testid=forgot-error] reads "Email not found in our records"

#### 3.4. Empty security code is reported

**File:** `apps/qapractice-com/tests/ui/forgot-password-empty-code.spec.ts`

**Steps:**
  1. Pass step 1 with the demo email, click Verify Code with the code empty.
    - expect: [data-testid=forgot-error] reads "Secret code is required"

#### 3.5. Wrong security code is rejected

**File:** `apps/qapractice-com/tests/ui/forgot-password-wrong-code.spec.ts`

**Steps:**
  1. Pass step 1, fill WRONG1, click Verify Code.
    - expect: [data-testid=forgot-error] reads "Invalid secret code"

#### 3.6. Empty reset fields are reported

**File:** `apps/qapractice-com/tests/ui/forgot-password-empty-reset.spec.ts`

**Steps:**
  1. Reach step 3 and click Reset Password with all fields empty.
    - expect: [data-testid=forgot-error] reads "All fields are required"

#### 3.7. New passwords that differ are rejected

**File:** `apps/qapractice-com/tests/ui/forgot-password-mismatch.spec.ts`

**Steps:**
  1. Reach step 3, fill demo password, New@12345, Other@123, click Reset Password.
    - expect: [data-testid=forgot-error] reads "Passwords do not match"

#### 3.8. Weak new password is rejected

**File:** `apps/qapractice-com/tests/ui/forgot-password-weak.spec.ts`

**Steps:**
  1. Reach step 3, fill demo password, short, short, click Reset Password.
    - expect: [data-testid=forgot-error] reads "Password does not meet requirements"

#### 3.9. Wrong current password is rejected (known bug)

**File:** `apps/qapractice-com/tests/ui/forgot-password-wrong-current-bug.spec.ts`

**Steps:**
  1. Reach step 3, fill current = Wrong@123, new and confirm = New@12345, click Reset Password.
    - expect: an error is shown and [data-testid=forgot-success] is not. **Live (2026-11-13): "Password Changed Successfully!" is shown.** Marked `test.fail()` until fixed.
