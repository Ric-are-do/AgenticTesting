# Automation Exercise Accounts Test Plan

## Application Overview

https://www.automationexercise.com (Signup / Login, account information,
logout, delete account). Published test cases 1-5 plus two extras. No stored
credentials: a test that needs an existing account gets one created through
the site's account API in setup (fixture `account`), and every account a test
registers is deleted in teardown (fixture `newUser`). Unique `@example.com`
emails. Ad domains are blocked. Fresh browser state assumed.

## Test Scenarios

### 1. Accounts

**Seed:** `apps/automation-exercise/tests/seed.spec.ts`

#### 1.1. Register User

**File:** `apps/automation-exercise/tests/ui/accounts-register-user.spec.ts`

**Steps:**
  1. Open the home page
    - expect: the slider text "Full-Fledged practice website for Automation Engineers" is visible
  2. Click 'Signup / Login' in the menu
    - expect: "New User Signup!" is visible
  3. Enter a name and a new email in [data-qa=signup-name] / [data-qa=signup-email] and click [data-qa=signup-button]
    - expect: "ENTER ACCOUNT INFORMATION" is visible
  4. Fill title, password, date of birth, tick 'Sign up for our newsletter!' and 'Receive special offers from our partners!', fill first name, last name, company, address, address2, country, state, city, zipcode, mobile number; click [data-qa=create-account]
    - expect: [data-qa=account-created] shows "ACCOUNT CREATED!"
  5. Click [data-qa=continue-button]
    - expect: "Logged in as <name>" is visible
  6. Click 'Delete Account'
    - expect: [data-qa=account-deleted] shows "ACCOUNT DELETED!"; Continue returns to the home page

#### 1.2. Login User with correct email and password

**File:** `apps/automation-exercise/tests/ui/accounts-login-correct.spec.ts`

**Steps:**
  1. With an existing account, open the home page and click 'Signup / Login'
    - expect: "Login to your account" is visible
  2. Enter the account's email and password and click [data-qa=login-button]
    - expect: "Logged in as <name>" is visible
  3. Click 'Delete Account'
    - expect: "ACCOUNT DELETED!" is visible

#### 1.3. Login User with incorrect email and password

**File:** `apps/automation-exercise/tests/ui/accounts-login-incorrect.spec.ts`

**Steps:**
  1. Open /login
    - expect: "Login to your account" is visible
  2. Enter an email no account uses and any password, click [data-qa=login-button]
    - expect: "Your email or password is incorrect!" is visible; the menu still shows 'Signup / Login'

#### 1.4. Logout User

**File:** `apps/automation-exercise/tests/ui/accounts-logout.spec.ts`

**Steps:**
  1. With an existing account, log in from /login
    - expect: "Logged in as <name>" is visible
  2. Click 'Logout'
    - expect: the URL is /login and "Login to your account" is visible

#### 1.5. Register User with existing email

**File:** `apps/automation-exercise/tests/ui/accounts-register-existing-email.spec.ts`

**Steps:**
  1. With an existing account, open /login
    - expect: "New User Signup!" is visible
  2. Enter a name and the account's email in the signup form, click [data-qa=signup-button]
    - expect: "Email Address already exist!" is visible and the page is still /signup's form start (no "ENTER ACCOUNT INFORMATION")

#### 1.6. A deleted account can no longer log in

**File:** `apps/automation-exercise/tests/ui/accounts-deleted-account-login.spec.ts`

**Steps:**
  1. With an existing account, log in and click 'Delete Account'
    - expect: "ACCOUNT DELETED!" is visible
  2. Open /login and log in with the same email and password
    - expect: "Your email or password is incorrect!" is visible

#### 1.7. Opening logout while logged out does not show a server error

**File:** `apps/automation-exercise/tests/ui/accounts-logout-logged-out-bug.spec.ts`

**Steps:**
  1. Without logging in, open /logout
    - expect: the response is not a server error (status below 500) and no "KeyError" debug page is shown (known bug, seen 2026-11-17: HTTP 500 with a Django debug traceback)
