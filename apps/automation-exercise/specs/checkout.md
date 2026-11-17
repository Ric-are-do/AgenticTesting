# Automation Exercise Checkout Test Plan

## Application Overview

https://www.automationexercise.com checkout: register or log in, checkout
page addresses and review, payment, order confirmation and invoice. Published
test cases 14, 15, 16, 23 and 24 plus two extras (one known bug). Registered
accounts are deleted in teardown (`newUser`); "login before checkout" uses an
account created by API (`account`). Fake card 4111 1111 1111 1111, CVC 123,
12/2030. Ad domains are blocked. Fresh browser state assumed.

## Test Scenarios

### 4. Place order

**Seed:** `apps/automation-exercise/tests/seed.spec.ts`

#### 4.1. Place Order: Register while Checkout

**File:** `apps/automation-exercise/tests/ui/checkout-register-while-checkout.spec.ts`

**Steps:**
  1. Add products 1 and 2 to the cart and open the cart
    - expect: the cart page shows both products
  2. Click 'Proceed To Checkout', then 'Register / Login'
    - expect: "New User Signup!" is visible
  3. Register a new account
    - expect: "ACCOUNT CREATED!", then "Logged in as <name>" after Continue
  4. Open the cart and click 'Proceed To Checkout'
    - expect: "Address Details" and "Review Your Order" are visible, total Rs. 900
  5. Enter a comment, click 'Place Order', enter the card details and click [data-qa=pay-button]
    - expect: "ORDER PLACED!" and "Congratulations! Your order has been confirmed!"
  6. Click 'Delete Account'
    - expect: "ACCOUNT DELETED!"

#### 4.2. Place Order: Register before Checkout

**File:** `apps/automation-exercise/tests/ui/checkout-register-before-checkout.spec.ts`

**Steps:**
  1. Register a new account from 'Signup / Login'
    - expect: "ACCOUNT CREATED!", then "Logged in as <name>"
  2. Add product 1 to the cart, open the cart, click 'Proceed To Checkout'
    - expect: "Address Details" and "Review Your Order" are visible
  3. Enter a comment, place the order and pay
    - expect: "ORDER PLACED!"
  4. Click 'Delete Account'
    - expect: "ACCOUNT DELETED!"

#### 4.3. Place Order: Login before Checkout

**File:** `apps/automation-exercise/tests/ui/checkout-login-before-checkout.spec.ts`

**Steps:**
  1. With an existing account, log in from 'Signup / Login'
    - expect: "Logged in as <name>"
  2. Add product 1 to the cart, open the cart, click 'Proceed To Checkout'
    - expect: "Address Details" and "Review Your Order" are visible
  3. Enter a comment, place the order and pay
    - expect: "ORDER PLACED!"
  4. Click 'Delete Account'
    - expect: "ACCOUNT DELETED!"

#### 4.4. Verify address details in checkout page

**File:** `apps/automation-exercise/tests/ui/checkout-address-details.spec.ts`

**Steps:**
  1. Register a new account
    - expect: "Logged in as <name>"
  2. Add product 1 to the cart, open the cart, click 'Proceed To Checkout'
    - expect: the delivery address (#address_delivery) shows "Mr. <first> <last>", company, address 1, address 2, "<city> <state> <zip>", country and phone from registration
    - expect: the billing address (#address_invoice) shows the same lines
  3. Click 'Delete Account'
    - expect: "ACCOUNT DELETED!"

#### 4.5. Download Invoice after purchase order

**File:** `apps/automation-exercise/tests/ui/checkout-download-invoice.spec.ts`

**Steps:**
  1. Add products 1 and 2 to the cart, proceed to checkout and register while checking out
    - expect: "Logged in as <name>"
  2. Open the cart, proceed to checkout, place the order and pay
    - expect: "ORDER PLACED!"
  3. Click 'Download Invoice'
    - expect: a file "invoice.txt" is downloaded containing "Hi <name>, Your total purchase amount is 900. Thank you"
  4. Click [data-qa=continue-button], then 'Delete Account'
    - expect: "ACCOUNT DELETED!"

#### 4.6. Payment with empty card details is blocked

**File:** `apps/automation-exercise/tests/ui/checkout-payment-empty.spec.ts`

**Steps:**
  1. With an existing account, log in, add product 1, proceed to checkout and click 'Place Order'
    - expect: the URL is /payment
  2. Click [data-qa=pay-button] with every card field empty
    - expect: the URL is still /payment and [data-qa=name-on-card] has the browser message "Please fill out this field."

#### 4.7. Payment with an invalid card is rejected

**File:** `apps/automation-exercise/tests/ui/checkout-invalid-card-bug.spec.ts`

**Steps:**
  1. With an existing account, log in, add product 1, proceed to checkout and click 'Place Order'
  2. Enter card number "abcd", CVC "1", month "13", year "1999" and click [data-qa=pay-button]
    - expect: the order is not placed: "ORDER PLACED!" is not shown (known bug, seen 2026-11-17: the order is confirmed)
