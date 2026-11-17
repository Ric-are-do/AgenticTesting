# Automation Exercise Site Pages Test Plan

## Application Overview

https://www.automationexercise.com contact form, test cases page, footer
subscription and scrolling. Published test cases 6, 7, 10, 11, 25 and 26 plus
one extra. No login. The contact form and the subscription send data to the
site (approved by the user, 2026-11-17). Ad domains are blocked. Fresh browser
state assumed.

## Test Scenarios

### 5. Site pages

**Seed:** `apps/automation-exercise/tests/seed.spec.ts`

#### 5.1. Contact Us Form

**File:** `apps/automation-exercise/tests/ui/site-contact-us.spec.ts`

**Steps:**
  1. Open the home page and click 'Contact us'
    - expect: "GET IN TOUCH" is visible
  2. Enter name, email, subject and message, upload a small text file, click [data-qa=submit-button] and press OK on "Press OK to proceed!"
    - expect: "Success! Your details have been submitted successfully." is visible
  3. Click 'Home'
    - expect: the home page is shown

#### 5.2. Verify Test Cases Page

**File:** `apps/automation-exercise/tests/ui/site-test-cases-page.spec.ts`

**Steps:**
  1. Open the home page and click 'Test Cases'
    - expect: the URL is /test_cases, "TEST CASES" is visible and "Test Case 1: Register User" is listed

#### 5.3. Verify Subscription in home page

**File:** `apps/automation-exercise/tests/ui/site-subscription-home.spec.ts`

**Steps:**
  1. Open the home page and scroll to the footer
    - expect: "SUBSCRIPTION" is visible
  2. Enter an email in #susbscribe_email and click #subscribe
    - expect: "You have been successfully subscribed!" is visible

#### 5.4. Verify Subscription in Cart page

**File:** `apps/automation-exercise/tests/ui/site-subscription-cart.spec.ts`

**Steps:**
  1. Open the home page and click 'Cart', scroll to the footer
    - expect: "SUBSCRIPTION" is visible
  2. Enter an email and click #subscribe
    - expect: "You have been successfully subscribed!" is visible

#### 5.5. Subscription with an invalid email is blocked

**File:** `apps/automation-exercise/tests/ui/site-subscription-invalid-email.spec.ts`

**Steps:**
  1. Open the home page, enter "not-an-email" in #susbscribe_email and click #subscribe
    - expect: the browser blocks it (the field's validation message mentions '@') and "You have been successfully subscribed!" is not shown

#### 5.6. Verify Scroll Up using 'Arrow' button and Scroll Down functionality

**File:** `apps/automation-exercise/tests/ui/site-scroll-up-arrow.spec.ts`

**Steps:**
  1. Open the home page and scroll to the bottom
    - expect: "SUBSCRIPTION" is visible
  2. Click the arrow (#scrollUp) at the bottom right
    - expect: the page is back at the top and "Full-Fledged practice website for Automation Engineers" is visible

#### 5.7. Verify Scroll Up without 'Arrow' button and Scroll Down functionality

**File:** `apps/automation-exercise/tests/ui/site-scroll-up-manual.spec.ts`

**Steps:**
  1. Open the home page and scroll to the bottom
    - expect: "SUBSCRIPTION" is visible
  2. Scroll back to the top
    - expect: "Full-Fledged practice website for Automation Engineers" is visible
